import type {
  Org,
  Products,
  Product,
  MIT,
  PMFLiveScore,
  PMFScoreOfSprint,
  PMFScore,
  ISODateTimeString,
} from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Product` Entity objects regardless of the underlying datasource.
 */
export abstract class IProductRepo {
  /**
   * Get all products of an Org.
   */
  abstract getOrgProducts(orgID: Org['id']): Promise<Products>;

  /**
   * Get the PMF live score.
   */
  abstract PMFLiveScore(productID: Product['id']): Promise<PMFLiveScore | null>;

  /**
   * Get PMF score of the sprint with the given sprint number.
   */
  abstract PMFScoreOfSprint(
    productID: Product['id'],
    sprintNumber: number,
  ): Promise<PMFScoreOfSprint>;

  /**
   * Get PMF score of the given time period.
   */
  abstract PMFScoreOfPeriod(
    productID: Product['id'],
    start: ISODateTimeString,
    end: ISODateTimeString,
  ): Promise<PMFScore>;

  /**
   * Get MITs of the given product's current sprint.
   */
  abstract currentMIT(productID: Product['id']): Promise<Array<MIT>>;
}
