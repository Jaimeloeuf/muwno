import type { ProductID, FeedbackForm, FeedbackResponse } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Feedback` Entity objects regardless of the underlying datasource.
 */
export abstract class IFeedbackRepo {
  /**
   * Get a single `FeedbackForm` Entity object back
   */
  abstract getOne(productID: ProductID): Promise<FeedbackForm | null>;

  /**
   * Save response of a feedback form.
   */
  abstract saveOne(
    productID: ProductID,
    response: FeedbackResponse,
  ): Promise<void>;

  /**
   * Get all survey responses of the selected product.
   */
  abstract getResponses(productID: ProductID): Promise<Array<any>>;
}
