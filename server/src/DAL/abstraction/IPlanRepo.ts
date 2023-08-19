import type { Plan } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Plan` Entity objects regardless of the underlying datasource.
 */
export abstract class IPlanRepo {
  /**
   * Get all active subscription Plan's Entity object.
   */
  abstract getActive(): Promise<Array<Plan>>;
}
