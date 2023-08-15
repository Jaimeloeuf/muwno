/**
 * Abstract interface for an AI Service.
 * Implement this and use this as the DI key.
 */
export abstract class IAiService {
  /**
   * Check if a given customer feedback is invalid, so that the caller can use
   * this to determine if they should continue processing the feedback anymore.
   *
   * This will check for invalid feedback like 'NA', 'NIL', etc etc and will
   * also check for non texts that are not feedbacks, like irrelevant statements
   * for example.
   */
  abstract isInvalidCustomerFeedback(
    customerFeedback: string,
  ): Promise<boolean>;

  /**
   * Get an actionable task string back given a valid customer feedback string
   * that has been validated using the `isInvalidCustomerFeedback` method.
   */
  abstract getActionableTask(
    validatedCustomerFeedback: string,
  ): Promise<string>;
}
