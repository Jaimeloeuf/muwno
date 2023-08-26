import type Stripe from 'stripe';

export function createFlatPrice(
  stripe: Stripe,
  idempotencyKey: string | undefined,
  productID: string,
  nameAndLookupKey: string,
  unitAmount: number,
  interval: Stripe.PriceCreateParams.Recurring.Interval,
) {
  return stripe.prices.create(
    {
      nickname: nameAndLookupKey,
      lookup_key: nameAndLookupKey,

      product: productID,

      unit_amount: unitAmount,

      currency: 'sgd',
      recurring: {
        interval,
      },

      expand: ['tiers'],
    },

    idempotencyKey ? { idempotencyKey } : {},
  );
}
