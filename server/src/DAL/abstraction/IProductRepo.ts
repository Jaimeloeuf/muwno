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
   * Check if user have access permission to this product.
   * If product does not exists, it is also treated as a lack of permission.
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
   * Get product's Org ID.
   */
  abstract getProductOrg(productID: ProductID): Promise<OrgID | null>;

  /**
   * Get all products of the user's Org.
   */
  abstract getUserOrgProducts(userID: UserID): Promise<Products>;

  /**
   * Create a new Product in data source
   */
  abstract createOne(
    productID: ProductID,
    orgID: OrgID,
    createOneProductDTO: CreateOneProductDTO,
  ): Promise<Product>;

  /**
   * Update a Product
   */
  abstract update(
    productID: ProductID,
    updateOneProductDTO: CreateOneProductDTO,
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
