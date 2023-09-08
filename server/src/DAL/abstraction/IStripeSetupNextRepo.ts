import type { StripeSetupNext } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `StripeSetupNext` Entities regardless of the underlying datasource.
 */
export abstract class IStripeSetupNextRepo {
  /**
   * Save one into the database
   */
  abstract saveOne(
    setupIntentID: string,
    next: Exclude<StripeSetupNext, null>,
  ): Promise<void>;
}
