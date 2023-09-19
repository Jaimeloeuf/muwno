import type {
  product as ProductModel,
  pmf_survey_responses as FeedbackResponseModel,
} from '@prisma/client';
import type { FeedbackForm, FeedbackResponse } from 'domain-model';

export const mapProductModelToEntity = (
  productModel: Pick<ProductModel, 'name'>,
): FeedbackForm => ({ productName: productModel.name });

export const mapFeedbackResponseModelToEntity = (
  response: FeedbackResponseModel,
): FeedbackResponse => ({
  id: response.id,
  createdAt: response.createdAt.toISOString(),
  productID: response.productID,

  // Safe to type cast since it is validated on write
  a1: response.a1 as 1 | 2 | 3,
  a2: response.a2,
  a3: response.a3,
  a4: response.a4,
});
