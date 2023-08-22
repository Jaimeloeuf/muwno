import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

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
  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    const nodeEnv = configService.get('NODE_ENV', { infer: true });
    const version = configService.get('version', { infer: true });

    this.stripe = new Stripe(
      configService.get('STRIPE_SECRET_KEY', { infer: true }),

      {
        // API Version is hardcoded as updating this will usually require code
        // update and is not just a configuration change.
        apiVersion: '2023-08-16',

        // For support and debugging (not required for production)
        appInfo: {
          name: `thepmftool-${nodeEnv}-${version}`,
          version,
          url: 'https://thepmftool.com',
        },
      },
    );

    this.stripeWebhookSecret = configService.get('STRIPE_WEBHOOK_SECRET', {
      infer: true,
    });

    this.stripeCheckoutRedirectUrl = configService.get(
      'STRIPE_CHECKOUT_REDIRECT_URL',
      { infer: true },
    );
  }

  /**
   * Hold the `Stripe` instance after creating it in constructor.
   */
  private readonly stripe: Stripe;

  /**
   * Hold the `STRIPE_WEBHOOK_SECRET` env var after reading it in constructor.
   */
  private readonly stripeWebhookSecret: string;

  /**
   * Hold the `STRIPE_CHECKOUT_REDIRECT_URL` env var after reading it in constructor.
   */
  private readonly stripeCheckoutRedirectUrl: string;

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
   * Create a new Stripe Checkout Session and get back the session's URL string
   * for client to redirect to.
   */
  async createCheckoutSession(planID: string) {
    // Lookup priceID from stripe using planID, so that frontend will be 'buying'
    // plan using planID from DB without having to save stripe specific priceID
    // for every new plan created in DB.
    const prices = await this.stripe.prices.list({
      lookup_keys: [planID],
      expand: ['data.product'],
    });

    // There should only be 1 match
    const priceID = prices.data[0]?.id;

    if (priceID === undefined)
      throw new Error(`Plan ${planID} does not exist as price lookup key.`);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',

      line_items: [
        // For metered billing, do not pass quantity
        { price: priceID, quantity: 1 },
      ],

      // Stripe Docs: {CHECKOUT_SESSION_ID} is a string literal; do not change
      // it! The actual Session ID is returned in the query parameter when the
      // customer is redirected to the success URL.
      success_url: `${this.stripeCheckoutRedirectUrl}?redirectReason=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.stripeCheckoutRedirectUrl}?redirectReason=cancelled`,
    });

    if (session.url === null)
      throw new Error(`Failed to get Stripe Checkout Session URL.`);

    return session.url;
  }

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   */
  async createPortalSession(session_id: string) {
    const customerEmail = '';

    // @todo Tmp way of just sending the portal link back for them to login themselves
    return `https://billing.stripe.com/p/login/test_8wM4gP5oxe0Zc5G6oo?prefilled_email=${encodeURI(
      customerEmail,
    )}`;
  }
}
