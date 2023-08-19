import { Controller, Get, Post, Param } from '@nestjs/common';

import { SubscriptionService } from '../services/subscription.service.js';

import { GuardWithRBAC, NoRoleRequired, JWT_uid } from '../../../rbac/index.js';

// Entity Types
import type { FirebaseAuthUID } from 'domain-model';

// DTO Types
import type { ReadManyActivePlanDTO } from 'domain-model';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('subscription')
@GuardWithRBAC()
@UseHttpControllerFilters
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Get all the currently available subscription plans.
   */
  @Get('plans')
  @NoRoleRequired // No role required since users can see all before choosing.
  async getPlans(): Promise<ReadManyActivePlanDTO> {
    return this.subscriptionService.getPlans().then((plans) => ({ plans }));
  }

  /**
   * Create a new Stripe Checkout Session and get back the session's URL string
   * for client to redirect to.
   */
  @Post('create-checkout-session/:planID')
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
}
