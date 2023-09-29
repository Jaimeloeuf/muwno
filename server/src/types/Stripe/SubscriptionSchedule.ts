import type { Customer } from './Customer.js';

export type SubscriptionSchedule = {
  /**
   * This is the Stripe Subscription Schedule ID.
   */
  id: string;

  /**
   * This is Stripe's Customer ID, **NOT** `UserID` or `OrgID`
   */
  customer: Customer['id'];
};
