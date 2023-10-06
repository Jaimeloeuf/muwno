import type Stripe from 'stripe';

import { createProduct } from './utils/createProduct';
import { createMonthlyGraduatedPrice } from './utils/createMonthlyGraduatedPrice';
import type { CreateIdempotentKey } from './utils/createIdempotentKeyFF';

import { PlanDetails } from '../../dist-domain';

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
    createIdempotentKey('email_product_usage_price_sgd'),
    email_product.id,
    'email-usage',
    'sgd',

    [
      // It is free for the first X email.
      {
        up_to: PlanDetails.included.email,
        flat_amount: 0,
      },

      {
        up_to: 'inf',
        // Using `unit_amount_decimal` instead of `unit_amount` since per unit
        // price of this product is less than the smallest unit of the currency
        // used. 1 cent is the smallest integer unit for SGD.
        // For example `unit_amount_decimal: '0.4'` means $0.004 per email
        unit_amount_decimal: `${PlanDetails.overage.email.price.SGD * 100}`,
      },
    ],
  );

  console.log('Created Email Product and its Prices');
}
