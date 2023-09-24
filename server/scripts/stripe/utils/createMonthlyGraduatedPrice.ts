import type Stripe from 'stripe';

/**
 * Create a price that uses the `Graduated pricing model` and bills every month.
 */
export function createMonthlyGraduatedPrice(
  stripe: Stripe,
  idempotencyKey: string | undefined,
  productID: string,
  nameAndLookupKey: string,
  currency: 'sgd' | 'usd',
  tiers: Stripe.PriceCreateParams['tiers'],
) {
  if (tiers === undefined)
    throw new Error(`Tiers is required in ${createMonthlyGraduatedPrice.name}`);

  return stripe.prices.create(
    {
      nickname: nameAndLookupKey,
      lookup_key: nameAndLookupKey,

      product: productID,

      tiers_mode: 'graduated',
      billing_scheme: 'tiered',
      tiers,

      currency,
      recurring: {
        interval: 'month',
        usage_type: 'metered',
      },

      expand: ['tiers'],
    },

    idempotencyKey ? { idempotencyKey } : undefined,
  );
}
