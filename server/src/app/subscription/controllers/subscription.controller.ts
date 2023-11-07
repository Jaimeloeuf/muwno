import { Controller, Get, Param } from '@nestjs/common';

import { SubscriptionService } from '../services/subscription.service.js';

import {
  GuardWithRBAC,
  NoRoleRequired,
  JWT_uid,
} from '../../../guards/index.js';

// Entity Types
import type { FirebaseAuthUID, OrgID } from 'domain-model';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('subscription')
@GuardWithRBAC()
@UseHttpControllerFilters
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Check the `Org's` subscription status.
   */
  @Get('status/:orgID')
  // No Roles required since user can call this endpoint to check for
  // subscription status even when they have not subscribed yet.
  @NoRoleRequired
  async checkSubscriptionStatus(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('orgID') orgID: OrgID,
  ): Promise<{ subscribed: boolean }> {
    return this.subscriptionService
      .isSubscribed(requestorID, orgID)
      .then((subscribed) => ({ subscribed }));
  }
}
