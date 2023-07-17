import type { product as ProductModel } from '@prisma/client';
import type { Products } from 'domain-model';

export function mapProductModelToEntity(
  productModels: Array<ProductModel>,
): Products {
  const products: Products = {};

  for (const productModel of productModels)
    products[productModel.id] = {
      id: productModel.id,
      createdAt: productModel.createdAt.toISOString(),
      name: productModel.name,

      // @todo Fix these values
      score: 1,
      currentSprint: 1,
      samplingDetails: {
        rate: 1,
        size: 1,
        maxSampleCount: 1,
        coolOff: 1,
      },
    };

  return products;
}
