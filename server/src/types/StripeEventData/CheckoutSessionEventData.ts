import type { OrgID } from 'domain-model';
import type { StripeCustomer } from '../StripeCustomer.js';

/**
 * See [CheckoutSessionEventData Sample](<./CheckoutSessionEventData Sample.md>)
 */
export type CheckoutSessionEventData = {
  /**
   * `OrgID` sent to Stripe in `StripeService.createCheckoutSession` for it to
   * reflect back for the system to reconcile Stripe's Customer ID and `OrgID`.
   */
  client_reference_id: OrgID;

  /**
   * This is Stripe's Customer ID, **NOT** `UserID` or `OrgID`
   */
  customer: StripeCustomer['id'];

  /**
   * Stripe Customer Email, this should be `Org['email']` unless customer
   * changes it manually in Stripe Customer Billing Portal, since this is set
   * for them in `StripeService.createCheckoutSession`.
   */
  customer_email: string;

  /**
   * Stripe's Subscription ID.
   */
  subscription: StripeCustomer['subscriptionID'];
};
