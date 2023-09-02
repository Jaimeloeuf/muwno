import { Controller, Post, Param } from '@nestjs/common';

import { SubscriptionService } from '../services/subscription.service.js';

import { GuardWithRBAC, JWT_uid, RolesRequired } from '../../../rbac/index.js';

// Entity Types
import { Role } from 'domain-model';
import type { FirebaseAuthUID } from 'domain-model';

// Exceptions
import { InvalidInputException } from '../../../exceptions/index.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('subscription')
@GuardWithRBAC()
@UseHttpControllerFilters
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   */
  @Post('stripe/create-portal-session')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async createPortalSession(@JWT_uid userID: FirebaseAuthUID): Promise<string> {
    return this.subscriptionService.createPortalSession(userID);
  }

  /**
   * Create a new Stripe Subscription for user to pay to activate their
   * subscription.
   */
  @Post('stripe/create-subscription/:paymentInterval')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async createSubscription(
    @JWT_uid userID: FirebaseAuthUID,
    @Param('paymentInterval') paymentInterval: string,
  ) {
    if (paymentInterval !== 'yearly' && paymentInterval !== 'monthly')
      throw new InvalidInputException(
        `Invalid payment interval: ${paymentInterval}`,
      );

    return this.subscriptionService.createSubscription(userID, paymentInterval);
  }
}
