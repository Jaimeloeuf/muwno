import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

import { Stripe } from '../infra/stripe.infra.js';
import { IStripeCustomerRepo } from '../../../DAL/index.js';

// Entity Types
import type { Org, OrgID } from 'domain-model';

// Exceptions
import { InvalidInternalStateException } from '../../../exceptions/index.js';

/**
 * Implements a Payment Service using Stripe.
 *
 * This does not implement an abstract interface because the interface would be
 * too hard to be abstracted out for different payment providers. Therefore this
 * will be used directly, and this service will encapsulate as much Stripe
 * specific logic as possible.
 */
@Injectable()
export class StripeService {
  constructor(
    private readonly stripe: Stripe,
    private readonly stripeCustomerRepo: IStripeCustomerRepo,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.stripeWebhookSecret = configService.get('STRIPE_WEBHOOK_SECRET', {
      infer: true,
    });

    this.stripeReturnUrl = configService.get('STRIPE_RETURN_URL', {
      infer: true,
    });
  }

  /**
   * Hold the `STRIPE_WEBHOOK_SECRET` env var after reading it in constructor.
   */
  private readonly stripeWebhookSecret: string;

  /**
   * Hold the `STRIPE_RETURN_URL` env var after reading it in constructor.
   */
  private readonly stripeReturnUrl: string;

  /**
   * Method to verify a Stripe webhook event by checking its signature before
   * creating the Event object and returning it.
   */
  async verifyAndConstructEvent(payload: Buffer, stripeSignature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      this.stripeWebhookSecret,
    );
  }

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   *
   * https://stripe.com/docs/customer-management/integrate-customer-portal
   */
  async createPortalSession(orgID: OrgID) {
    const stripeCustomerID =
      await this.stripeCustomerRepo.getCustomerIDWithOrgID(orgID);

    if (stripeCustomerID === null)
      throw new InvalidInternalStateException(
        `Org '${orgID}' does not have a Stripe Customer ID`,
      );

    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: stripeCustomerID,

      // This is the url to which the customer will be redirected when they are
      // done managing their billing with the portal.
      return_url: this.stripeReturnUrl,
    });

    if (portalSession.url === null)
      throw new Error(`Failed to get Stripe Customer Portal Session URL.`);

    return portalSession.url;
  }

  /**
   * Check if a given Stripe coupon is valid.
   */
  async checkCouponValidity(couponID: string) {
    try {
      // This will throw an error if coupon is not found
      const coupon = await this.stripe.coupons.retrieve(couponID);

      // If coupon found but not valid, throw error to indicate coupon invalid
      if (!coupon.valid) throw new Error('Invalid coupon');

      return { valid: true };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Create a new Stripe Customer for the given `Org` and save its details.
   */
  async createCustomer(org: Org) {
    // @todo check if org already has a stripe customer attached to it

    const customer = await this.stripe.customers.create({
      name: org.name,
      email: org.email,

      // @todo Add this once we start collecting their phone numbers
      // phone: org.phone,

      metadata: {
        // Save org.id as metadata in case it needs to be retrieved during
        // reconciliation processes between this system and Stripe.
        orgID: org.id,
      },
    });

    await this.stripeCustomerRepo.createOne(org.id, customer.id);
  }
}
