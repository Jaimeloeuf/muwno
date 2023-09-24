import type { StripeCustomer } from '../StripeCustomer.js';

/**
 * See [SubscriptionDeletedEventData Sample](<./SubscriptionDeletedEventData Sample.md>)
 */
export type SubscriptionDeletedEventData = {
  /**
   * This is the Stripe Subscription ID.
   */
  id: string;

  /**
   * This is Stripe's Customer ID, **NOT** `UserID` or `OrgID`
   */
  customer: StripeCustomer['id'];
};
