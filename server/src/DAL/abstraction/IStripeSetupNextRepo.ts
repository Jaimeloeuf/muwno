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

  /**
   * Get one from the database
   */
  abstract getOne(setupIntentID: string): Promise<StripeSetupNext | null>;

  /**
   * Delete one from the database
   */
  abstract deleteOne(id: number): Promise<void>;
}
