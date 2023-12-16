import type Stripe from 'stripe';

export function createFlatPrice(
  stripe: Stripe,
  idempotencyKey: string | undefined,
  productID: string,
  nameAndLookupKey: string,
  interval: Stripe.PriceCreateParams.Recurring.Interval,
  unitAmount: number,
  currency: 'usd',
) {
  return stripe.prices.create(
    {
      nickname: nameAndLookupKey,
      lookup_key: nameAndLookupKey,
      transfer_lookup_key: true,

      product: productID,

      unit_amount: unitAmount,

      currency,
      recurring: {
        interval,
      },
    },

    idempotencyKey ? { idempotencyKey } : undefined,
  );
}
