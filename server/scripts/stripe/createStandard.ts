import type Stripe from 'stripe';

import { createProduct } from './utils/createProduct';
import { createFlatPrice } from './utils/createFlatPrice';
import { dollarsToUnitAmount } from './utils/dollarsToUnitAmount';
import type { CreateIndempotentKey } from './utils/createIndempotentKeyFF';

/**
 * Create `Standard` product and prices
 */
export async function createStandard(
  stripe: Stripe,
  createIndempotentKey: CreateIndempotentKey,
) {
  // This is the one with the flat monthly fee
  const standard_product = await createProduct(
    stripe,
    createIndempotentKey('standard_product'),
    'Standard',
  );

  await createFlatPrice(
    stripe,
    createIndempotentKey('standard_product_monthly_price'),
    standard_product.id,
    'standard-monthly',
    dollarsToUnitAmount(100),
    'month',
  );

  await createFlatPrice(
    stripe,
    createIndempotentKey('standard_product_yearly_price'),
    standard_product.id,
    'standard-yearly',
    dollarsToUnitAmount(1000),
    'year',
  );
}
