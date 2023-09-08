import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

import {
  IStripeCustomerRepo,
  IStripeSetupNextRepo,
} from '../../../DAL/index.js';

// Entity Types
import type { Org, OrgID } from 'domain-model';
import type { SetupIntentSucceededEventData } from '../../../types/index.js';

// DTO Types
import type { CreateOneStripeSetupNextDTO } from 'domain-model';

// Exceptions
import { InvalidInternalStateException } from '../../../exceptions/index.js';

// Stripe Subscription Utils
import {
  getStandardProductPrice,
  getMeteredProductPrice,
  createSubsciption,
} from './stripe.service.utils.js';

/**
 * Implements a Payment Service using Stripe.
 *
 * This does not implement an abstract interface because the interface would be
 * too hard to be abstracted out for different payment providers. Therefore this
 * will be used directly, and this service will encapsulate as much Stripe
 * specific logic as possible.
 */
@Injectable()
export class StripeService {
  constructor(
    private readonly stripeCustomerRepo: IStripeCustomerRepo,
    private readonly stripeSetupNextRepo: IStripeSetupNextRepo,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    const nodeEnv = configService.get('NODE_ENV', { infer: true });
    const version = configService.get('version', { infer: true });

    this.stripe = new Stripe(
      configService.get('STRIPE_SECRET_KEY', { infer: true }),

      {
        // API Version is hardcoded as updating this will usually require code
        // update and is not just a configuration change.
        apiVersion: '2023-08-16',

        // For support and debugging (not required for production)
        appInfo: {
          name: `thepmftool-${nodeEnv}-${version}`,
          version,
          url: 'https://thepmftool.com',
        },
      },
    );

    this.stripeWebhookSecret = configService.get('STRIPE_WEBHOOK_SECRET', {
      infer: true,
    });

    this.stripeReturnUrl = configService.get('STRIPE_RETURN_URL', {
      infer: true,
    });
  }

  /**
   * Hold the `Stripe` instance after creating it in constructor.
   */
  private readonly stripe: Stripe;

  /**
   * Hold the `STRIPE_WEBHOOK_SECRET` env var after reading it in constructor.
   */
  private readonly stripeWebhookSecret: string;

  /**
   * Hold the `STRIPE_RETURN_URL` env var after reading it in constructor.
   */
  private readonly stripeReturnUrl: string;

  /**
   * Method to verify a Stripe webhook event by checking its signature before
   * creating the Event object and returning it.
   */
  async verifyAndConstructEvent(payload: Buffer, stripeSignature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      this.stripeWebhookSecret,
    );
  }

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   *
   * https://stripe.com/docs/customer-management/integrate-customer-portal
   */
  async createPortalSession(orgID: OrgID) {
    const stripeCustomerID =
      await this.stripeCustomerRepo.getCustomerIDWithOrgID(orgID);

    if (stripeCustomerID === null)
      throw new InvalidInternalStateException(
        `Org '${orgID}' does not have a Stripe Customer ID`,
      );

    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: stripeCustomerID,

      // This is the url to which the customer will be redirected when they are
      // done managing their billing with the portal.
      return_url: this.stripeReturnUrl,
    });

    if (portalSession.url === null)
      throw new Error(`Failed to get Stripe Customer Portal Session URL.`);

    return portalSession.url;
  }

  /**
   * Check if a given Stripe coupon is valid.
   */
  async checkCouponValidity(couponID: string) {
    try {
      // This will throw an error if coupon is not found
      const coupon = await this.stripe.coupons.retrieve(couponID);

      // If coupon found but not valid, throw error to indicate coupon invalid
      if (!coupon.valid) throw new Error('Invalid coupon');

      return { valid: true };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Create a new Stripe Customer for the given `Org` and save its details.
   */
  async createCustomer(org: Org) {
    // @todo check if org already has a stripe customer attached to it

    const customer = await this.stripe.customers.create({
      name: org.name,
      email: org.email,

      // @todo Add this once we start collecting their phone numbers
      // phone: org.phone,

      metadata: {
        // Save org.id as metadata in case it needs to be retrieved during
        // reconciliation processes between this system and Stripe.
        orgID: org.id,
      },
    });

    await this.stripeCustomerRepo.createOne(org.id, customer.id);
  }

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
      await this.stripe.setupIntents.create({ customer: stripeCustomer.id });

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
      await this.buySubscription(
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
  }

  async buySubscription(
    stripeCustomerID: string,
    paymentInterval: 'yearly' | 'monthly',
    coupon: null | string,
  ) {
    const standardProductPrice = await getStandardProductPrice(
      this.stripe,
      paymentInterval,
    );
    const meteredProductPrice = await getMeteredProductPrice(this.stripe);

    if (paymentInterval === 'monthly') {
      // Create a single subscription since everything uses the same billing interval
      const subscription = await createSubsciption(
        this.stripe,
        stripeCustomerID,
        [standardProductPrice, ...meteredProductPrice],
        coupon,
      );

      // @todo This might happen if 3DS requires user action and subscription becomes incomplete
      if (subscription.status !== 'active')
        throw new Error(
          `Subscription '${subscription.id}' did not succeed: '${subscription.status}'`,
        );

      // @todo Save to Subscriptions table as Orgs can have more than 1 subscription
      subscription.id;
    }

    // Create 2 subscriptions since the billing interval used is different
    else {
      // Create the subscription using an annual billing interval
      const annualSubscription = await createSubsciption(
        this.stripe,
        stripeCustomerID,
        [standardProductPrice],
        coupon,
      );

      // @todo This might happen if 3DS requires user action and subscription becomes incomplete
      if (annualSubscription.status !== 'active')
        throw new Error(
          `Subscription '${annualSubscription.id}' did not succeed: '${annualSubscription.status}'`,
        );

      // @todo Save to Subscriptions table as Orgs can have more than 1 subscription
      annualSubscription.id;

      /* ================================================================= */

      // Create the subscription using a monthly billing interval
      const monthlySubscription = await createSubsciption(
        this.stripe,
        stripeCustomerID,
        meteredProductPrice,

        // Coupon only applies to the 'Standard' product so this is always null
        null,
      );

      // @todo This might happen if 3DS requires user action and subscription becomes incomplete
      if (monthlySubscription.status !== 'active')
        throw new Error(
          `Subscription '${monthlySubscription.id}' did not succeed: '${monthlySubscription.status}'`,
        );

      // @todo Save to Subscriptions table as Orgs can have more than 1 subscription
      monthlySubscription.id;
    }
  }
}
