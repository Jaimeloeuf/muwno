import { Controller, Get, Param } from '@nestjs/common';

import { StripeSubscriptionService } from '../services/stripe-subscription.service.js';

import { GuardWithRBAC, RolesRequired } from '../../../guards/index.js';

// Entity Types
import { Role } from 'domain-model';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('stripe/subscription')
@GuardWithRBAC()
@UseHttpControllerFilters
export class StripeSubscriptionController {
  constructor(
    private readonly stripeSubscriptionService: StripeSubscriptionService,
  ) {}

  /**
   * Check if a given Stripe coupon is valid.
   */
  @Get('coupon/check-validity/:couponID')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async checkCouponValidity(
    @Param('couponID') couponID: string,
  ): Promise<{ valid: boolean }> {
    return this.stripeSubscriptionService.checkCouponValidity(couponID);
  }
}
