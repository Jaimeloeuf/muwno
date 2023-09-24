import type { OrgID } from 'domain-model';
import type { Customer } from '../../types/index.js';

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
  ): Promise<Customer | null>;

  /**
   * Get a `StripeCustomer` object back using a `OrgID`.
   */
  abstract getCustomerWithOrgID(orgID: OrgID): Promise<Customer | null>;

  /**
   * Get `StripeCustomer` Entity ID of the given `OrgID`.
   */
  abstract getCustomerIDWithOrgID(orgID: OrgID): Promise<Customer['id'] | null>;

  /**
   * Create and save a new `StripeCustomer` object in data source.
   */
  abstract createOne(
    orgID: OrgID,
    stripeCustomerID: Customer['id'],
  ): Promise<void>;
}
