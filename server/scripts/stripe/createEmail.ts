import type Stripe from 'stripe';

import { createProduct } from './utils/createProduct';
import { createMonthlyGraduatedPrice } from './utils/createMonthlyGraduatedPrice';
import type { CreateIdempotentKey } from './utils/createIdempotentKeyFF';

/**
 * Create `Email` product and prices
 */
export async function createEmail(
  stripe: Stripe,
  createIdempotentKey: CreateIdempotentKey,
) {
  // Email is a product because it is something chargeable
  const email_product = await createProduct(
    stripe,
    createIdempotentKey('email_product'),
    'Email',
  );

  await createMonthlyGraduatedPrice(
    stripe,
    createIdempotentKey('email_product_usage_price'),
    email_product.id,
    'email-usage',

    [
      // It is free for the first 300 emails.
      {
        up_to: 300,
        flat_amount: 0,
      },

      // Subsequently it is $3 per 1,000 emails, which means $0.003 per email
      {
        up_to: 'inf',
        unit_amount_decimal: '0.3',
      },
    ],
  );
}
