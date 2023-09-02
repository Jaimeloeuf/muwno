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
 */
export async function getMeteredProductPrice(stripe: Stripe) {
  const prices = await stripe.prices.list({
    lookup_keys: ['response-usage', 'email-usage'],
  });

  // The returned prices are not ordered based on the lookup key, therefore
  // it is transformed into an object with lookup key as the key so that they
  // can be shown with the exact sequence when returned
  const priceLookupKeyToIdMapping: Record<string, string> = {};

  for (const price of prices.data) {
    if (price.lookup_key === null)
      throw new Error(
        'invalid state since price definitely have lookup key as thats what we use to load it',
      );

    priceLookupKeyToIdMapping[price.lookup_key] = price.id;
  }

  if (priceLookupKeyToIdMapping['response-usage'] === undefined)
    throw new Error(`Cannot get Price with lookup key 'response-usage'`);
  if (priceLookupKeyToIdMapping['email-usage'] === undefined)
    throw new Error(`Cannot get Price with lookup key 'email-usage'`);

  // Do not set quantity value for prices using metered usage billing.
  return [
    { price: priceLookupKeyToIdMapping['response-usage'] },
    { price: priceLookupKeyToIdMapping['email-usage'] },
  ];
}

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
) {
  return stripe.subscriptions.create({
    // Subscription will be paid with customer's default payment method,
    // therefore they must have one attached else this will fail.
    customer: stripeCustomerID,

    // This is needed to indicate this is a Merchant Initiated Transaction.
    off_session: true,

    items,
  });
}
