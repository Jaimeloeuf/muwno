import { Injectable } from '@nestjs/common';

import { Stripe } from '../infra/stripe.infra.js';
import { StripeSubscriptionService } from './stripe-subscription.service.js';
import {
  IStripeCustomerRepo,
  IStripeSetupNextRepo,
} from '../../../DAL/index.js';

// Entity Types
import type { Org } from 'domain-model';
import type { SetupIntentSucceededEventData } from '../../../types/index.js';

// DTO Types
import type { CreateOneStripeSetupNextDTO } from 'domain-model';

// Exceptions
import { InvalidInternalStateException } from '../../../exceptions/index.js';

@Injectable()
export class StripeSetupintentService {
  constructor(
    private readonly stripe: Stripe,
    private readonly stripeSubscriptionService: StripeSubscriptionService,
    private readonly stripeCustomerRepo: IStripeCustomerRepo,
    private readonly stripeSetupNextRepo: IStripeSetupNextRepo,
  ) {}

  /**
   * Create a new Stripe Setup Intent to get back the setup intent client secret
   * to confirm setup on frontend and create a new Stripe Payment Method using
   * the collected payment info.
   */
  async createSetupIntent(
    org: Org,
    createOneStripeSetupNextDTO: CreateOneStripeSetupNextDTO,
  ) {
    // @todo Or search from Stripe API using org.id meta data
    const stripeCustomer = await this.stripeCustomerRepo.getCustomerWithOrgID(
      org.id,
    );

    if (stripeCustomer === null)
      throw new InvalidInternalStateException(
        `Org '${org.id}' does not have a Stripe Customer created.`,
      );

    const { id, client_secret: clientSecret } =
      await this.stripe.setupIntents.create({
        customer: stripeCustomer.id,
      });

    if (clientSecret === null)
      throw new Error(`Failed to get Stripe Setup Intent Client Secret.`);

    // If user requested for a next action, save to DB.
    if (createOneStripeSetupNextDTO.next !== null)
      await this.stripeSetupNextRepo.saveOne(
        id,
        createOneStripeSetupNextDTO.next,
      );

    return {
      id,
      clientSecret,
      orgEmail: org.email,
    };
  }

  /**
   * Handle SetupIntent success webhook event by attaching the newly created
   * payment method as the customer's default payment method and executing any
   * `StripeSetupNext` actions stored by the user during `createSetupIntent`.
   */
  async onSetupIntentSuccess(setupIntent: SetupIntentSucceededEventData) {
    // Attach payment method as customer's default payment method, so that when
    // creating subscriptions for them, it will automatically use this payment
    // method instead of having to explicitly pass in a payment method.
    await this.stripe.customers.update(setupIntent.customer, {
      invoice_settings: { default_payment_method: setupIntent.payment_method },
    });

    // Read from DB to see if user requested for any Next actions to be executed
    // on Stripe Setup Intent successfully completing.
    const stripeSetupNextAction = await this.stripeSetupNextRepo.getOne(
      setupIntent.id,
    );

    // If no StripeSetupNext action requested by user, end this method.
    if (stripeSetupNextAction === null) {
      return;
    }

    // If user requested for Standard Plan subscription to be created
    else if (stripeSetupNextAction.success.intent === 'create-subscription') {
      await this.stripeSubscriptionService.buySubscription(
        setupIntent.customer,
        stripeSetupNextAction.success.paymentInterval,
        stripeSetupNextAction.success.coupon,
      );
    }

    // This should not happen since all Next action types must be accounted for.
    else {
      throw new Error(
        `Invalid StripeSetupNext success intent: ${stripeSetupNextAction.success.intent}`,
      );
    }

    // Delete stored `StripeSetupNext` once it has successfully executed.
    await this.stripeSetupNextRepo.deleteOne(stripeSetupNextAction.id);
  }
}