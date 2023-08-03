import type {
  Org,
  UserID,
  Products,
  Product,
  MIT,
  PMFLiveScore,
  PMFScore,
  ISODateTimeString,
  CreateOneProductDTO,
} from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Product` Entity objects regardless of the underlying datasource.
 */
export abstract class IProductRepo {
  /**
   * Check if a product exists, and test if a product ID is valid.
   */
  abstract productExists(productID: Product['id']): Promise<boolean>;

  /**
   * Get all products of an Org.
   */
  abstract getOrgProducts(orgID: Org['id']): Promise<Products>;

  /**
   * Get all products of the user's Org.
   */
  abstract getUserOrgProducts(userID: UserID): Promise<Products>;

  /**
   * Create a new Product in data source
   */
  abstract createOne(
    orgID: Org['id'],
    createOneProductDTO: CreateOneProductDTO,
  ): Promise<Product>;

  /**
   * Get the PMF live score.
   */
  abstract PMFLiveScore(productID: Product['id']): Promise<PMFLiveScore | null>;

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

  /**
   * Mark a single 'MIT' task as done.
   */
  abstract markTaskAsDone(mitID: MIT['id']): Promise<Array<MIT>>;
}
