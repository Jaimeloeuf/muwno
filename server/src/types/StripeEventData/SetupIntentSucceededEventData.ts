import type { StripeCustomer } from '../StripeCustomer.js';

/**
 * Only typing properties that are remotely useful and ignoring everything else.
 * <!-- See [SetupIntentSucceededEventData Sample](<./SetupIntentSucceededEventData Sample.md>) -->
 */
export type SetupIntentSucceededEventData<Metadata = any> = {
  /**
   * This is the Stripe Setup Intent ID.
   */
  id: string;

  /**
   * This is Stripe's Customer ID, **NOT** `UserID` or `OrgID`
   */
  customer: StripeCustomer['id'];

  /**
   * This is the ID of the Payment Method created by the Setup Intent.
   */
  payment_method: string;

  /**
   * Indicates how the payment method is intended to be used in the future.
   * For our use case, it should always be off session since the creation of
   * subscription plans is separate from collection of payment info to allow for
   * multiple simultaneous subscriptions created and user only need to key in
   * payment details once.
   */
  usage: 'off_session' | 'on_session';

  /**
   * Client Secret for the Stripe Setup Intent.
   */
  client_secret: string;

  /**
   * The last error encountered when trying to complete the Setup Intent.
   */
  last_setup_error: string;

  /**
   * Metadata set during the creation of the Setup Intent.
   * This is a generic that can be set on the type root as needed.
   */
  metadata: Metadata;
};
