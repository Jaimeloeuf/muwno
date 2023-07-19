import type { product as ProductModel } from '@prisma/client';
import type { FeedbackForm } from 'domain-model';

export const mapProductModelToEntity = (
  productModel: Pick<ProductModel, 'name'>,
): FeedbackForm => ({ productName: productModel.name });
