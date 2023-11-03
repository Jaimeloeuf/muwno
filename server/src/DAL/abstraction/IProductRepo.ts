import type {
  OrgID,
  UserID,
  Products,
  ProductID,
  Product,
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
  abstract productExists(productID: ProductID): Promise<boolean>;

  /**
   * Check if user have access permission to this product.
   */
  abstract canUserAccessProduct(
    userID: UserID,
    productID: ProductID,
  ): Promise<boolean>;

  /**
   * Get a single product the user can access.
   */
  abstract getProduct(
    userID: UserID,
    productID: ProductID,
  ): Promise<null | Product>;

  /**
   * Get all products of an Org.
   */
  abstract getOrgProducts(orgID: OrgID): Promise<Products>;

  /**
   * Get all products of the user's Org.
   */
  abstract getUserOrgProducts(userID: UserID): Promise<Products>;

  /**
   * Create a new Product in data source
   */
  abstract createOne(
    id: string,
    orgID: OrgID,
    createOneProductDTO: CreateOneProductDTO,
  ): Promise<Product>;

  /**
   * Delete a single product.
   */
  abstract deleteOne(productID: ProductID): Promise<void>;

  /**
   * Transfer product to a different Org.
   */
  abstract transfer(productID: ProductID, orgID: OrgID): Promise<void>;
}
