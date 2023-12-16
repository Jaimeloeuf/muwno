import type Stripe from 'stripe';

import { createProduct } from './utils/createProduct';
import { createMonthlyGraduatedPrice } from './utils/createMonthlyGraduatedPrice';
import type { CreateIdempotentKey } from './utils/createIdempotentKeyFF';

import { PlanDetails } from '../../dist-domain';

/**
 * Create `CustomerStored` product and prices
 */
export async function createCustomerStored(
  stripe: Stripe,
  createIdempotentKey: CreateIdempotentKey,
) {
  // Customer Stored is a product because it is something chargeable
  const customerStored_product = await createProduct(
    stripe,
    createIdempotentKey('customerStored_product'),
    'Customer Stored',
  );

  await createMonthlyGraduatedPrice(
    stripe,
    createIdempotentKey('customerStored_product_usage_price_usd'),
    customerStored_product.id,
    'customer-stored',
    'usd',

    [
      // It is free for the first X customer stored.
      {
        up_to: PlanDetails.included.customerStored,
        flat_amount: 0,
      },

      {
        up_to: 'inf',
        // Using `unit_amount_decimal` instead of `unit_amount` since per unit
        // price of this product is less than the smallest unit of the currency
        // used. 1 cent is the smallest integer unit for USD.
        // For example `unit_amount_decimal: '0.4'` means $0.004 per email
        unit_amount_decimal: `${
          PlanDetails.overage.customerStored.price.USD * 100
        }`,
      },
    ],
  );

  console.log('Created Customer Stored Product and its Prices');
}
