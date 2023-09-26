import { Injectable } from '@nestjs/common';

import { Stripe } from '../infra/stripe.infra.js';
import { IOrgRepo, IStripeCustomerRepo } from '../../../DAL/index.js';

// Entity Types
import type { UserID, Org } from 'domain-model';

// Exceptions
import { InvalidInternalStateException } from '../../../exceptions/index.js';

@Injectable()
export class StripeCustomerService {
  constructor(
    private readonly stripe: Stripe,
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
      throw new Error(`Failed to get Stripe Customer Portal Session URL.`);

    return portalSession.url;
  }

  /**
   * @todo Only create if Org does not have a corresponding Stripe Customer
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
