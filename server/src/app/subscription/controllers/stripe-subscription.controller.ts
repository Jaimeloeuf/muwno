import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Redirect,
  Query,
} from '@nestjs/common';

import { SubscriptionService } from '../services/subscription.service.js';
import { StripeService } from '../services/stripe.service.js';

import {
  GuardWithRBAC,
  JWT_uid,
  RolesRequired,
  AllowUnauthenticatedRequest,
} from '../../../rbac/index.js';

// Entity Types
import { Role } from 'domain-model';
import type { FirebaseAuthUID } from 'domain-model';

// DTO Types
import type { CreateOneStripeSetupNextDTO } from 'domain-model';

// Exceptions
import { InvalidInputException } from '../../../exceptions/index.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('subscription/stripe')
@GuardWithRBAC()
@UseHttpControllerFilters
export class StripeSubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeService: StripeService,
  ) {}

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   */
  @Post('create-portal-session')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async createPortalSession(@JWT_uid userID: FirebaseAuthUID): Promise<string> {
    return this.subscriptionService.createPortalSession(userID);
  }

  /**
   * Check if a given Stripe coupon is valid.
   */
  @Get('coupon/check-validity/:couponID')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async checkCouponValidity(
    @Param('couponID') couponID: string,
  ): Promise<{ valid: boolean }> {
    return this.stripeService.checkCouponValidity(couponID);
  }

  /**
   * Create Stripe Setup Intent for client secret to setup payment method, and
   * optionally receives a StripeSetupNext Action object to describe the next
   * action the API service should take once the setup intent is successfully
   * completed and Stripe notifies the service via a webhook call.
   */
  @Post('create-setup-intent')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async createSetupIntent(
    @JWT_uid userID: FirebaseAuthUID,

    /**
     * @todo
     * Not doing DTO validation for now since this is an internal endpoint and
     * is too troublesome to validate this nested union type.
     */
    @Body() createOneStripeSetupNextDTO: CreateOneStripeSetupNextDTO,
  ): Promise<{ id: string; clientSecret: string; orgEmail: string }> {
    return this.subscriptionService.createSetupIntent(
      userID,
      createOneStripeSetupNextDTO,
    );
  }

  /**
   * API to reflect a redirect back to client portal from Stripe API, since
   * Stripe's confirmSetupIntent method's return_url does not support URL's
   * using hash based routing, therefore this is needed to redirect to a
   * specific page on portal using hash based routing.
   */
  @Get('redirect/setup-intent-confirmed')
  // Default redirect if nothing returned to override it.
  // Make sure to always return a Nest redirect object to change this.
  @Redirect('/', 301)
  // Allow unauthenticated requests since this is a redirect end point and no
  // protection needed as no sensitive business logic is called.
  @AllowUnauthenticatedRequest
  async redirectOnSetupIntentConfirmed(
    @Query('redirect_status') redirectStatus: string,
    @Query('setup_intent') setupIntentID: string,

    /**
     * Required, but allow undefined here to ensure type is checked before using
     */
    @Query('redirectTo') redirectTo: string | undefined,
  ): Promise<{ url: string }> {
    if (redirectTo === undefined)
      throw new InvalidInputException(`Missing 'redirectTo' query param.`);

    return {
      // @todo add redirectStatus from stripe as query param for frontend to show user
      url: decodeURIComponent(redirectTo),
    };
  }
}
