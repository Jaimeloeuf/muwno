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

    this.stripeReturnUrl = configService.get('STRIPE_RETURN_URL', {
      infer: true,
    });
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

  /**
   * Create a new Stripe Setup Intent to get back the setup intent client secret
   * to confirm setup on frontend and create a new Stripe Payment Method using
   * the collected payment info.
   */
  async createSetupIntent(org: Org) {
    // @todo Or search from Stripe API using org.id meta data
    const stripeCustomer = await this.stripeCustomerRepo.getCustomerWithOrgID(
      org.id,
    );

    if (stripeCustomer === null)
      throw new InvalidInternalStateException(
        `Org '${org.id}' does not have a Stripe Customer created.`,
      );

    const { client_secret: clientSecret } =
      await this.stripe.setupIntents.create({
        customer: stripeCustomer.id,
      });

    if (clientSecret === null)
      throw new Error(`Failed to get Stripe Setup Intent Client Secret.`);

    return {
      clientSecret,
      orgEmail: org.email,
    };
  }
}
