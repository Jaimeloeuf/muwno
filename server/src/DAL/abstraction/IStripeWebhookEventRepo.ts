/**
 * Data Repository interface used as an abstraction over a collection of
 * `stripe_webhook_event` Entities regardless of the underlying datasource.
 */
export abstract class IStripeWebhookEventRepo {
  /**
   * Check if the given Stripe Webhook Event is unprocessed, if it is, return
   * true and record its ID so that it can be used for future checks.
   */
  abstract isUnprocessed(
    id: string,
    type: string,
    livemode: boolean,
  ): Promise<boolean>;

  /**
   * Mark a given Stripe Webhook Event as processed.
   */
  abstract markAsProcessed(id: string): Promise<void>;
}
