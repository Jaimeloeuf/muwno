import type { product as ProductModel } from '@prisma/client';
import type { Products } from 'domain-model';
import dayjs from 'dayjs';

/**
 * Utility function to calculate current sprint number of a `Product` using its
 * `createdAt` timestamp as the start of its first sprint, and `daysPerSprint`
 * value as each sprint's interval.
 */
function getCurrentSprintNumber(productModel: ProductModel) {
  const today = dayjs();
  const productFirstSprintStartDate = dayjs(productModel.createdAt);
  const daysSinceFirstSprint = today.diff(
    productFirstSprintStartDate,
    'day',
    true,
  );
  const currentSprintNumber = Math.trunc(
    daysSinceFirstSprint / productModel.daysPerSprint,
  );
  return currentSprintNumber;
}

export function mapProductModelToEntity(
  productModels: Array<ProductModel>,
): Products {
  const products: Products = {};

  for (const productModel of productModels)
    products[productModel.id] = {
      id: productModel.id,
      createdAt: productModel.createdAt.toISOString(),
      name: productModel.name,
      currentSprint: getCurrentSprintNumber(productModel),

      // @todo Fix these values
      score: 1,
      samplingDetails: {
        rate: 1,
        size: 1,
        maxSampleCount: 1,
        coolOff: 1,
      },
    };

  return products;
}
