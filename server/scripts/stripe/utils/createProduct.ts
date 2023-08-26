import type Stripe from 'stripe';

export async function createProduct(
  stripe: Stripe,
  idempotencyKey: string | undefined,
  productName: string,
) {
  return stripe.products.create(
    {
      name: productName,
    },

    idempotencyKey ? { idempotencyKey } : {},
  );
}
