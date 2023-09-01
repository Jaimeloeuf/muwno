import type { OrgID, ISODateTimeString } from 'domain-model';

/**
 * `StripeCustomer` entity object holds a required stripe customer data to
 * interact with the Stripe API.
 */
export interface StripeCustomer {
  /**
   * This is Stripe's Customer ID, **NOT** `UserID` or `OrgID`
   */
  id: string;

  /**
   * When was this Entity created and stored in data source.
   */
  createdAt: ISODateTimeString;

  /**
   * Stripe's Subscription ID for subscription payments.
   */
  subscriptionID: string | null;

  /**
   * `OrgID` since every `StripeCustomer` is a paying `Org`.
   */
  orgID: OrgID;
}
