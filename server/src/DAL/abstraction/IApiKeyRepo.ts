import type {
  ApiKeyDetail,
  UserID,
  ProductID,
  ApiKeyDetailID,
} from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `ApiKey` Entity objects regardless of the underlying datasource.
 */
export abstract class IApiKeyRepo {
  /**
   * Get a list of all the API Key Detail objects for a given product.
   */
  abstract getProductApiKeys(
    productID: ProductID,
  ): Promise<Array<ApiKeyDetail>>;

  /**
   * Get a single API Key Detail object back using its ID.
   */
  abstract getOne(apiKeyID: ApiKeyDetailID): Promise<ApiKeyDetail | null>;

  /**
   * Save a newly created API Key.
   */
  abstract saveOne(
    productID: ProductID,
    createdBy: UserID,
    hash: string,
    prefix: string,
  ): Promise<ApiKeyDetail>;

  /**
   * Delete an API Key.
   */
  abstract deleteOne(apiKeyID: ApiKeyDetailID): Promise<void>;
}
