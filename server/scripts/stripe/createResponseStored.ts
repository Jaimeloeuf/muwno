import type Stripe from 'stripe';

import { createProduct } from './utils/createProduct';
import { createMonthlyGraduatedPrice } from './utils/createMonthlyGraduatedPrice';
import type { CreateIdempotentKey } from './utils/createIdempotentKeyFF';

import { PlanDetails } from '../../dist-domain';

/**
 * Create `ResponsesStored` product and prices
 */
export async function createResponseStored(
  stripe: Stripe,
  createIdempotentKey: CreateIdempotentKey,
) {
  // Response Stored is a product because it is something chargeable
  const responseStored_product = await createProduct(
    stripe,
    createIdempotentKey('responseStored_product'),
    'Response Stored',
  );

  await createMonthlyGraduatedPrice(
    stripe,
    createIdempotentKey('responseStored_product_usage_price_usd'),
    responseStored_product.id,
    'response-stored',
    'usd',

    [
      // It is free for the first X response stored.
      {
        up_to: PlanDetails.included.responseStored,
        flat_amount: 0,
      },

      {
        up_to: 'inf',
        // Using `unit_amount_decimal` instead of `unit_amount` since per unit
        // price of this product is less than the smallest unit of the currency
        // used. 1 cent is the smallest integer unit for USD.
        // For example `unit_amount_decimal: '0.4'` means $0.004 per email
        unit_amount_decimal: `${
          PlanDetails.overage.responseStored.price.USD * 100
        }`,
      },
    ],
  );

  console.log('Created Response Stored Product and its Prices');
}
