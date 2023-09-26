import { Controller, Post, Query } from '@nestjs/common';

import { StripeCustomerService } from '../services/stripe-customer.service.js';

import {
  GuardWithRBAC,
  JWT_uid,
  RolesRequired,
} from '../../../guards/index.js';

// Entity Types
import { Role } from 'domain-model';
import type { FirebaseAuthUID } from 'domain-model';

// Exceptions
import { InvalidInputException } from '../../../exceptions/index.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('stripe/customer')
@GuardWithRBAC()
@UseHttpControllerFilters
export class StripeCustomerController {
  constructor(private readonly stripeCustomerService: StripeCustomerService) {}

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   */
  @Post('create-portal-session')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async createPortalSession(
    @JWT_uid userID: FirebaseAuthUID,

    /**
     * Required, but union with undefined to ensure type is checked before using
     */
    @Query('returnUrl') returnUrl: string | undefined,
  ): Promise<string> {
    if (returnUrl === undefined)
      throw new InvalidInputException(`Missing 'returnUrl' query param.`);

    return this.stripeCustomerService.createPortalSession(userID, returnUrl);
  }
}
