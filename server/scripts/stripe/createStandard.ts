import type Stripe from 'stripe';

import { createProduct } from './utils/createProduct';
import { createFlatPrice } from './utils/createFlatPrice';
import { dollarsToUnitAmount } from './utils/dollarsToUnitAmount';
import type { CreateIdempotentKey } from './utils/createIdempotentKeyFF';

// import { PlanDetails } from '../../dist-domain';

/**
 * @todo
 * This is temporarily archived and not used anymore as no base subscription is
 * required to use the product anymore.
 *
 * Create `Standard` product and prices
 */
export async function createStandard(
  stripe: Stripe,
  createIdempotentKey: CreateIdempotentKey,
) {
  // This is the one with the flat monthly fee
  const standard_product = await createProduct(
    stripe,
    createIdempotentKey('standard_product'),
    'Standard',
  );

  await createFlatPrice(
    stripe,
    createIdempotentKey('standard_product_monthly_price_sgd'),
    standard_product.id,
    'standard-monthly',
    'month',
    dollarsToUnitAmount(/* @todo PlanDetails.price.SGD.monthly */ 1),
    'sgd',
  );

  await createFlatPrice(
    stripe,
    createIdempotentKey('standard_product_yearly_price_sgd'),
    standard_product.id,
    'standard-yearly',
    'year',
    dollarsToUnitAmount(/* @todo PlanDetails.price.SGD.yearly */ 1),
    'sgd',
  );

  console.log('Created Standard Product and its Prices');
}
