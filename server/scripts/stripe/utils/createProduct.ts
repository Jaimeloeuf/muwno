import type Stripe from 'stripe';

export async function createProduct(
  stripe: Stripe,
  idempotencyKey: string,
  productName: string,
) {
  return stripe.products.create(
    {
      name: productName,
    },

    { idempotencyKey },
  );
}
