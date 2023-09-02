import { Controller, Post } from '@nestjs/common';

import { SubscriptionService } from '../services/subscription.service.js';

import { GuardWithRBAC, JWT_uid, RolesRequired } from '../../../rbac/index.js';

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
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   */
  @Post('stripe/create-portal-session')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async createPortalSession(@JWT_uid userID: FirebaseAuthUID): Promise<string> {
    return this.subscriptionService.createPortalSession(userID);
  }

  /**
   * Create Stripe Setup Intent for client secret to setup payment method.
   */
  @Post('stripe/create-setup-intent')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async createSetupIntent(@JWT_uid userID: FirebaseAuthUID) {
    return this.subscriptionService.createSetupIntent(userID);
  }
}
