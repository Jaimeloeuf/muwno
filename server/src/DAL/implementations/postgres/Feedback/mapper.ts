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
  ...response,

  createdAt: response.createdAt.toISOString(),

  // Safe to type cast since it is validated on write
  a1: response.a1 as 1 | 2 | 3,
});
