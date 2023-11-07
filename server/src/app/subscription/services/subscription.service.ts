import { Injectable } from '@nestjs/common';

import { ISubscriptionRepo } from '../../../DAL/index.js';
import { OrgService } from '../../org/services/org.service.js';

// Entity Types
import type { UserID, OrgID } from 'domain-model';

/**
 * `SubscriptionService` handles all subscription related business logic.
 */
@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepo: ISubscriptionRepo,
    private readonly orgService: OrgService,
  ) {}

  /**
   * Check if the `Org` is subscribed.
   */
  async isSubscribed(requestorID: UserID, orgID: OrgID) {
    // Validate if user can access this Org
    await this.orgService.validateUserAccess(requestorID, orgID);
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
