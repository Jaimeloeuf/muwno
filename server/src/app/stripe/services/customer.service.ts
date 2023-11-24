import { Injectable } from '@nestjs/common';
import type { Stripe } from 'stripe';

import { StripeClient } from '../infra/stripe-client.js';
import { IOrgRepo, IStripeCustomerRepo } from '../../../DAL/index.js';

// Entity Types
import type { UserID, Org } from 'domain-model';

// Exceptions
import {
  InvalidInternalStateException,
  ServiceException,
} from '../../../exceptions/index.js';

@Injectable()
export class StripeCustomerService {
  constructor(
    private readonly stripe: StripeClient,
    private readonly orgRepo: IOrgRepo,
    private readonly stripeCustomerRepo: IStripeCustomerRepo,
  ) {}

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   *
   * https://stripe.com/docs/customer-management/integrate-customer-portal
   */
  async createPortalSession(
    userID: UserID,
    returnUrl: string,
  ): Promise<string> {
    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new InvalidInternalStateException(
        `User '${userID}' cannot access portal as they do not have an Org`,
      );

    const stripeCustomerID =
      await this.stripeCustomerRepo.getCustomerIDWithOrgID(org.id);

    if (stripeCustomerID === null)
      throw new InvalidInternalStateException(
        `Org '${org.id}' does not have a Stripe Customer ID`,
      );

    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: stripeCustomerID,

      // This is the url to which the customer will be redirected when they are
      // done managing their billing with the portal. This URL is passed from
      // the frontend.
      return_url: returnUrl,
    });

    if (portalSession.url === null)
      throw new ServiceException(
        `Failed to get Stripe Customer Portal Session URL.`,
      );

    return portalSession.url;
  }

  /**
   * @todo Only create if Org does not have a corresponding Stripe Customer
   * Create a new Stripe Customer for the given `Org` and save its details.
   */
  async createCustomer(org: Org) {
    // @todo check if org already has a stripe customer attached to it

    const customerOptions = {
      name: org.name,
      email: org.email,

      // Save org.id as metadata in case it needs to be retrieved during
      // reconciliation processes between this system and Stripe.
      metadata: { orgID: org.id },
    } satisfies Stripe.CustomerCreateParams;

    const customer = await this.stripe.customers.create(
      org.phone === null
        ? customerOptions
        : { ...customerOptions, phone: org.phone },
    );

    await this.stripeCustomerRepo.createOne(org.id, customer.id);
  }

  /**
   * Update Stripe Customer details using Org details.
   */
  async updateCustomerDetails(org: Org) {
    const customerOptions = {
      name: org.name,
      email: org.email,

      // Save org.id as metadata in case it needs to be retrieved during
      // reconciliation processes between this system and Stripe.
      metadata: { orgID: org.id },
    } satisfies Stripe.CustomerUpdateParams;

    const stripeCustomerID =
      await this.stripeCustomerRepo.getCustomerIDWithOrgID(org.id);

    if (stripeCustomerID === null)
      throw new InvalidInternalStateException(
        `Org ${org.id} does not have a Stripe Customer ID stored.`,
      );

    await this.stripe.customers.update(
      stripeCustomerID,
      org.phone === null
        ? customerOptions
        : { ...customerOptions, phone: org.phone },
    );
  }
}
