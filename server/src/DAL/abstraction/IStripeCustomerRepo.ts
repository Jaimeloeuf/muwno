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

  /**
   * Create and save a new `StripeCustomer` object in data source.
   */
  abstract createOne(
    orgID: OrgID,
    stripeCustomerID: StripeCustomer['id'],
    stripeSubscriptionID: StripeCustomer['subscriptionID'],
  ): Promise<void>;
}
