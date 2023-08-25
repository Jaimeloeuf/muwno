import type { product as ProductModel, mit as MITModel } from '@prisma/client';
import type { Product, Products, MIT } from 'domain-model';

export const mapProductModelToEntity = (
  productModel: ProductModel,
): Product => ({
  id: productModel.id,
  createdAt: productModel.createdAt.toISOString(),
  name: productModel.name,
});

export function mapProductModelsToEntity(
  productModels: Array<ProductModel>,
): Products {
  const products: Products = {};

  for (const productModel of productModels)
    products[productModel.id] = mapProductModelToEntity(productModel);

  return products;
}

export const mapMITModelsToEntity = (mitModels: Array<MITModel>): Array<MIT> =>
  mitModels.map((mitModel) => ({
    ...mitModel,
    createdAt: mitModel.createdAt.toISOString(),
  }));
