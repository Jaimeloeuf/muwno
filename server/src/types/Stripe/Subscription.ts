import type { Customer } from './Customer.js';

export type Subscription = {
  /**
   * This is the Stripe Subscription ID.
   */
  id: string;

  /**
   * This is Stripe's Customer ID, **NOT** `UserID` or `OrgID`
   */
  customer: Customer['id'];
};
