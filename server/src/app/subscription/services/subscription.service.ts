import { Injectable } from '@nestjs/common';

import { IOrgRepo, ISubscriptionRepo } from '../../../DAL/index.js';
import { StripeService } from './stripe.service.js';
import { StripeSetupintentService } from './stripe-setupintent.service.js';

// Entity Types
import type { UserID, OrgID } from 'domain-model';

// DTO Types
import type { CreateOneStripeSetupNextDTO } from 'domain-model';

// Exceptions
import { InvalidInternalStateException } from '../../../exceptions/index.js';

/**
 * `SubscriptionService` handles all subscription related business logic.
 *
 * Although there are parts of subscription logic that relies on the external
 * Stripe service, it should be fully encapsulated in the `StripeService` class
 * and not pollute here with any Stripe specific logic. So even if it might be
 * still highly dependent, the code itself should be well separated.
 */
@Injectable()
export class SubscriptionService {
  constructor(
    private readonly orgRepo: IOrgRepo,
    private readonly subscriptionRepo: ISubscriptionRepo,
    private readonly stripeService: StripeService,
    private readonly stripeSetupintentService: StripeSetupintentService,
  ) {}

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   */
  async createPortalSession(userID: UserID): Promise<string> {
    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new InvalidInternalStateException(
        `User '${userID}' cannot access portal as they do not have an Org`,
      );

    // @todo track the user's request using their ID

    return this.stripeService.createPortalSession(org.id);
  }

  /**
   * Wrapper around Stripe Service's `createSetupIntent` to load `Org` from the
   * requestor's `UserID`.
   */
  async createSetupIntent(
    userID: UserID,
    createOneStripeSetupNextDTO: CreateOneStripeSetupNextDTO,
  ) {
    // @todo track the user's request using their ID

    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new InvalidInternalStateException(
        `User '${userID}' cannot setup payment method as they don't have an Org`,
      );

    return this.stripeSetupintentService.createSetupIntent(
      org,
      createOneStripeSetupNextDTO,
    );
  }

  /**
   * Activate the `Org`'s subscription.
   */
  async activateSubscription(orgID: OrgID): Promise<void> {
    await this.subscriptionRepo.activateSubscription(orgID);
  }

  /**
   * Deactivate the `Org`'s subscription.
   */
  async deactivateSubscription(orgID: OrgID): Promise<void> {
    await this.subscriptionRepo.deactivateSubscription(orgID);
  }
}
