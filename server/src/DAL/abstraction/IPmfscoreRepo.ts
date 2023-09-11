import type { ProductID, PMFScore, ISODateTimeString } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `PMF Score` Entity objects regardless of the underlying datasource.
 */
export abstract class IPmfscoreRepo {
  /**
   * Get PMF score of the given time period.
   */
  abstract PMFScoreOfPeriod(
    productID: ProductID,
    start: ISODateTimeString,
    end: ISODateTimeString,
  ): Promise<PMFScore>;
}
