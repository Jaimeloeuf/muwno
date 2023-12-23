import type { OrgID, ISODateTimeString } from 'domain-model';

export interface Customer {
  /**
   * This is Stripe's Customer ID, **NOT** `UserID` or `OrgID`
   */
  id: string;

  /**
   * This is Stripe's Subscription ID for the metered product. This is optional
   * since this is only set once the subscription goes into effect.
   */
  meteredSubscriptionID: string | null;

  /**
   * When was this Entity created and stored in data source.
   */
  createdAt: ISODateTimeString;

  /**
   * `OrgID` since every `StripeCustomer` is a paying `Org`.
   */
  orgID: OrgID;
}
