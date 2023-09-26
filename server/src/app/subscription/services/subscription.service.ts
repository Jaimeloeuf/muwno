import { Injectable } from '@nestjs/common';

import { ISubscriptionRepo } from '../../../DAL/index.js';

// Entity Types
import type { OrgID } from 'domain-model';

/**
 * `SubscriptionService` handles all subscription related business logic.
 */
@Injectable()
export class SubscriptionService {
  constructor(private readonly subscriptionRepo: ISubscriptionRepo) {}

  /**
   * Check if the `Org` is subscribed.
   */
  async isSubscribed(orgID: OrgID) {
    return this.subscriptionRepo.isSubscribed(orgID);
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
