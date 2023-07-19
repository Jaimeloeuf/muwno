import type { Product, FeedbackForm, FeedbackResponse } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Feedback` Entity objects regardless of the underlying datasource.
 */
export abstract class IFeedbackRepo {
  /**
   * Get a single `FeedbackForm` Entity object back
   */
  abstract getOne(productID: Product['id']): Promise<FeedbackForm | null>;

  /**
   * Save response of a feedback form.
   */
  abstract saveOne(
    productID: Product['id'],
    response: FeedbackResponse,
  ): Promise<void>;
}
