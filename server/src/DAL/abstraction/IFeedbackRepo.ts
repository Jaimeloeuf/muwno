import type {
  ProductID,
  FeedbackForm,
  CreateOneFeedbackResponseDTO,
  FeedbackResponse,
  FeedbackResponseID,
} from 'domain-model';

export type DBFeedbackResponse = Omit<
  FeedbackResponse,
  'id' | 'productID' | 'createdAt'
> & { createdAt: Date };

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Feedback` Entity objects regardless of the underlying datasource.
 */
export abstract class IFeedbackRepo {
  /**
   * Get a single `FeedbackForm` Entity object back
   */
  abstract getOneFeedbackForm(
    productID: ProductID,
  ): Promise<FeedbackForm | null>;

  /**
   * Save response of a feedback form.
   */
  abstract saveOneResponse(
    id: string,
    productID: ProductID,
    response: CreateOneFeedbackResponseDTO,
  ): Promise<FeedbackResponseID>;

  /**
   * Get a single response.
   */
  abstract getResponse(
    responseID: FeedbackResponseID,
  ): Promise<FeedbackResponse | null>;

  /**
   * Get all survey responses of the selected product.
   */
  abstract getResponses(
    productID: ProductID,
  ): Promise<Array<DBFeedbackResponse>>;

  /**
   * Get product ID of the given response.
   */
  abstract getResponseProduct(
    responseID: FeedbackResponseID,
  ): Promise<ProductID | null>;
}
