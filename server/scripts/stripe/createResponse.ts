import type Stripe from 'stripe';

import { createProduct } from './utils/createProduct';
import { createMonthlyGraduatedPrice } from './utils/createMonthlyGraduatedPrice';
import { createIndempotentKey } from './utils/createIndempotentKey';

/**
 * Create `Response` product and prices
 */
export async function createResponse(stripe: Stripe) {
  // Response is a product because it is something chargeable
  const response_product = await createProduct(
    stripe,
    createIndempotentKey('response_product'),
    'Response',
  );

  await createMonthlyGraduatedPrice(
    stripe,
    createIndempotentKey('response_product_usage_price'),
    response_product.id,
    'response-usage',

    [
      // It is free for the first 300 responses.
      {
        up_to: 300,
        flat_amount: 0,
      },

      // Subsequently it is $3 per 100 responses, which means $0.03 per response
      {
        up_to: 'inf',
        unit_amount: 3,
      },
    ],
  );
}
