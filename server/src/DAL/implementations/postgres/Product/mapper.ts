import type { product as ProductModel, mit as MITModel } from '@prisma/client';
import type { Products, MIT, SurveyMode } from 'domain-model';

export function mapProductModelsToEntity(
  productModels: Array<ProductModel>,
): Products {
  const products: Products = {};

  for (const productModel of productModels)
    products[productModel.id] = {
      id: productModel.id,
      createdAt: productModel.createdAt.toISOString(),
      name: productModel.name,

      // No need for runtime check here since there is a runtime check on write.
      surveyMode: productModel.surveyMode as SurveyMode,
    };

  return products;
}

export const mapMITModelsToEntity = (mitModels: Array<MITModel>): Array<MIT> =>
  mitModels.map((mitModel) => ({
    ...mitModel,
    createdAt: mitModel.createdAt.toISOString(),
  }));
