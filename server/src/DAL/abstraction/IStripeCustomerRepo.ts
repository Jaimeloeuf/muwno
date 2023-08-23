import type { OrgID } from 'domain-model';
import type { StripeCustomer } from '../../types/index.js';

/**
 * Data Repository interface used as an abstraction over underlying datasource
 * to handle persisted Stripe Customer data.
 */
export abstract class IStripeCustomerRepo {
  /**
   * Get a `StripeCustomer` object back using a stripe customer ID.
   */
  abstract getCustomerWithStripeCustomerID(
    stripeCustomerID: string,
  ): Promise<StripeCustomer | null>;

  // /**
  //  * Get a `StripeCustomer` object back using a `OrgID`.
  //  */
  // abstract getCustomerWithOrgID(orgID: OrgID): Promise<StripeCustomer | null>;

  /**
   * Get `StripeCustomer` Entity ID of the given `OrgID`.
   */
  abstract getCustomerIDWithOrgID(
    orgID: OrgID,
  ): Promise<StripeCustomer['id'] | null>;

  /**
   * Create and save a new `StripeCustomer` object in data source.
   */
  abstract createOne(
    orgID: OrgID,
    stripeCustomerID: StripeCustomer['id'],
    stripeSubscriptionID: StripeCustomer['subscriptionID'],
  ): Promise<void>;
}
