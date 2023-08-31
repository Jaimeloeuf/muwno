import type Stripe from 'stripe';

import { createProduct } from './utils/createProduct';
import { createFlatPrice } from './utils/createFlatPrice';
import { dollarsToUnitAmount } from './utils/dollarsToUnitAmount';
import type { CreateIdempotentKey } from './utils/createIdempotentKeyFF';

/**
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
    createIdempotentKey('standard_product_monthly_price'),
    standard_product.id,
    'standard-monthly',
    dollarsToUnitAmount(100),
    'month',
  );

  await createFlatPrice(
    stripe,
    createIdempotentKey('standard_product_yearly_price'),
    standard_product.id,
    'standard-yearly',
    dollarsToUnitAmount(1000),
    'year',
  );
}
