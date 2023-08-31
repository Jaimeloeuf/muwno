import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

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
    private readonly stripeCustomerRepo: IStripeCustomerRepo,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
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
  async createCheckoutSession(planID: string, org: Org) {
    // Lookup priceID from stripe using planID, so that frontend will be 'buying'
    // plan using planID from DB without having to save stripe specific priceID
    // for every new plan created in DB.
    // const prices = await this.stripe.prices.list({
    //   lookup_keys: [planID],
    //   expand: ['data.product'],
    // });
    const prices = await this.stripe.prices.list({
      lookup_keys: [
        // @todo Either
        'standard-monthly',
        // 'standard-yearly',

        'response-usage',
        'email-usage',
      ],
      expand: ['data.product'],
    });

    // The returned prices are not ordered based on the lookup key, therefore
    // it is transformed into an object with lookup key as the key so that they
    // can be shown with the exact sequence required in line_items
    const priceLookupKeyToIdMapping: Record<string, string> = {};

    for (const price of prices.data) {
      if (price.lookup_key === null)
        throw new Error(
          'invalid state since price definitely have lookup key as thats what we use to load it',
        );

      priceLookupKeyToIdMapping[price.lookup_key] = price.id;
    }

    // If any of the price is missing...
    // @todo use Internal server error since its a server setup issue
    if (priceLookupKeyToIdMapping['standard-monthly'] === undefined)
      throw new Error(`Cannot get Price with lookup key 'standard-monthly'`);
    if (priceLookupKeyToIdMapping['response-usage'] === undefined)
      throw new Error(`Cannot get Price with lookup key 'response-usage'`);
    if (priceLookupKeyToIdMapping['email-usage'] === undefined)
      throw new Error(`Cannot get Price with lookup key 'email-usage'`);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',

      // A unique string to reference the Checkout Session used to reconcile the
      // Checkout Session with our internal systems later when the event is sent
      // to the Webhook Controller to process. In the webhook handler, it can
      // use this value to know what is the orgID that just paid/subscribed.
      client_reference_id: org.id,

      // Use the Org's main administrative email address for billing instead of
      // being a individual user's email address. Note that by setting this, the
      // user cannot edit it anymore in the checkout UI.
      customer_email: org.email,

      // Allow customer to enter a promo code
      allow_promotion_codes: true,

      line_items: [
        { price: priceLookupKeyToIdMapping['standard-monthly'], quantity: 1 },

        // For metered billing, do not pass quantity
        { price: priceLookupKeyToIdMapping['response-usage'] },
        { price: priceLookupKeyToIdMapping['email-usage'] },
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
      return_url: this.stripeCheckoutRedirectUrl,
    });

    if (portalSession.url === null)
      throw new Error(`Failed to get Stripe Customer Portal Session URL.`);

    return portalSession.url;

    // Alternative using a hardcoded link that requires email OTP to login
    // https://stripe.com/docs/customer-management/activate-no-code-customer-portal#url-parameters
    //
    // const org = await this.orgRepo.getOne(orgID);
    // if (org === null)
    //   throw new InvalidInternalStateException(`Org '${orgID}' does not exists`);
    //
    // return `${stripeBillingPortalLink}?prefilled_email=${encodeURI(org.email)}`;
  }
}
