import { Controller, Post, Param } from '@nestjs/common';

import { SubscriptionService } from '../services/subscription.service.js';

import {
  GuardWithRBAC,
  NoRoleRequired,
  JWT_uid,
  RolesRequired,
} from '../../../rbac/index.js';

// Entity Types
import { Role } from 'domain-model';
import type { FirebaseAuthUID } from 'domain-model';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('subscription')
@GuardWithRBAC()
@UseHttpControllerFilters
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Create a new Stripe Checkout Session and get back the session's URL string
   * for client to redirect to.
   */
  @Post('stripe/create-checkout-session/:planID')
  @NoRoleRequired // No role required since users can pay before creating an Org
  async createCheckoutSession(
    @JWT_uid userID: FirebaseAuthUID,

    // `planID` is a number but since it is passed as a URL path param, it is
    // now a string, which conveniently is used as the Stripe Price lookup key
    // because it expects lookup key to be a static string.
    @Param('planID') planID: string,
  ): Promise<string> {
    return this.subscriptionService.createCheckoutSession(userID, planID);
  }

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   */
  @Post('stripe/create-portal-session')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async createPortalSession(@JWT_uid userID: FirebaseAuthUID): Promise<string> {
    return this.subscriptionService.createPortalSession(userID);
  }
}
