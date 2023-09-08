import type { Stripe } from 'stripe';

// Exceptions
import { InvalidInternalStateException } from '../../../exceptions/index.js';

/**
 * Get the subscription item object for the Standard Subscription product's
 * Stripe Price based on the payment interval.
 */
export async function getStandardProductPrice(
  stripe: Stripe,
  paymentInterval: 'yearly' | 'monthly',
) {
  const standardProductLookupKey =
    paymentInterval === 'yearly' ? 'standard-yearly' : 'standard-monthly';

  const { data } = await stripe.prices.list({
    lookup_keys: [standardProductLookupKey],
  });

  const priceID = data[0]?.id;

  // Throw error if no priceID found for the given lookup key and Stripe did
  // not throw, since Stripe will throw if not found.
  if (priceID === undefined)
    throw new InvalidInternalStateException(
      `Stripe PriceID for '${standardProductLookupKey}' not found`,
    );

  return {
    price: priceID,

    // Quantity is fixed to 1 as user subscribes to Standard product once.
    quantity: 1,
  };
}

/**
 * Get subscription item array of all Usage Metered Products' Stripe Price.
 *
 * Returned objects do not have `quantity` value set since prices using metered
 * usage billing should not have a fixed quantity set.
 */
export const getMeteredProductPrice = (stripe: Stripe) =>
  stripe.prices
    .list({ lookup_keys: ['response-usage', 'email-usage'] })
    .then(({ data }) => data.map((price) => ({ price: price.id })));

/**
 * Thin wrapper around Stripe's create subscription method.
 *
 * Creates a new Stripe Subscription for the given Customer and Items, and pay
 * using the Customer's default payment method (must be available else throws)
 * in `off_session` mode (needs to be setup first).
 */
export async function createSubsciption(
  stripe: Stripe,
  stripeCustomerID: string,
  items: Stripe.SubscriptionCreateParams.Item[],
  coupon: null | string,
) {
  return stripe.subscriptions.create({
    // Subscription will be paid with customer's default payment method,
    // therefore they must have one attached else this will fail.
    customer: stripeCustomerID,

    // This is needed to indicate this is a Merchant Initiated Transaction.
    off_session: true,

    items,

    // @todo Fix this type gymnastics
    // Cannot be null so convert to undefined first
    coupon: (coupon ?? undefined) as string,
  });
}
