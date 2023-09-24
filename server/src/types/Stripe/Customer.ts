import type { OrgID, ISODateTimeString } from 'domain-model';

export interface Customer {
  /**
   * This is Stripe's Customer ID, **NOT** `UserID` or `OrgID`
   */
  id: string;

  /**
   * When was this Entity created and stored in data source.
   */
  createdAt: ISODateTimeString;

  /**
   * `OrgID` since every `StripeCustomer` is a paying `Org`.
   */
  orgID: OrgID;
}
