import { Injectable } from '@nestjs/common';

import { IOrgRepo, ISubscriptionRepo } from '../../../DAL/index.js';
import { StripeService } from './stripe.service.js';

// Entity Types
import type { UserID, OrgID } from 'domain-model';

// Exceptions
import { InvalidInternalStateException } from '../../../exceptions/index.js';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly orgRepo: IOrgRepo,
    private readonly subscriptionRepo: ISubscriptionRepo,
    private readonly stripeService: StripeService,
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
  async createSetupIntent(userID: UserID) {
    // @todo track the user's request using their ID

    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new InvalidInternalStateException(
        `User '${userID}' cannot setup payment method as they don't have an Org`,
      );

    return this.stripeService.createSetupIntent(org);
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
