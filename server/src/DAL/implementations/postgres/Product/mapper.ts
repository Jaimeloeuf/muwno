import type { product as ProductModel } from '@prisma/client';
import type { Product, Products } from 'domain-model';

export const mapProductModelToEntity = (
  productModel: ProductModel,
): Product => ({
  id: productModel.id,
  createdAt: productModel.created_at.toISOString(),
  name: productModel.name,
  description: productModel.description,
});

export function mapProductModelsToEntity(
  productModels: Array<ProductModel>,
): Products {
  const products: Products = {};

  for (const productModel of productModels)
    products[productModel.id] = mapProductModelToEntity(productModel);

  return products;
}
