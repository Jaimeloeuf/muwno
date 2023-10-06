import type Stripe from 'stripe';

import { createProduct } from './utils/createProduct';
import { createMonthlyGraduatedPrice } from './utils/createMonthlyGraduatedPrice';
import type { CreateIdempotentKey } from './utils/createIdempotentKeyFF';

import { PlanDetails } from '../../dist-domain';

/**
 * Create `Response` product and prices
 */
export async function createResponse(
  stripe: Stripe,
  createIdempotentKey: CreateIdempotentKey,
) {
  // Response is a product because it is something chargeable
  const response_product = await createProduct(
    stripe,
    createIdempotentKey('response_product'),
    'Response',
  );

  await createMonthlyGraduatedPrice(
    stripe,
    createIdempotentKey('response_product_usage_price_sgd'),
    response_product.id,
    'response-usage',
    'sgd',

    [
      // It is free for the first X response.
      {
        up_to: PlanDetails.included.response,
        flat_amount: 0,
      },

      {
        up_to: 'inf',
        // For example `unit_amount: 5` means $0.05 per response
        unit_amount: PlanDetails.overage.response.price.SGD * 100,
      },
    ],
  );

  console.log('Created Response Product and its Prices');
}
