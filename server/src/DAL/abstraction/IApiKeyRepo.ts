import type {
  ApiKeyDetail,
  UserID,
  OrgID,
  ApiKeyDetailID,
  Org,
} from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `ApiKey` Entity objects regardless of the underlying datasource.
 */
export abstract class IApiKeyRepo {
  /**
   * Get all API Key Detail objects of the Org.
   */
  abstract getOrgApiKeyDetails(orgID: OrgID): Promise<Array<ApiKeyDetail>>;

  /**
   * Get a single API Key Detail object back using its ID.
   */
  abstract getOne(apiKeyID: ApiKeyDetailID): Promise<ApiKeyDetail | null>;

  /**
   * Save a newly created API Key.
   */
  abstract saveOne(
    id: string,
    orgID: OrgID,
    createdBy: UserID,
    hash: string,
    prefix: string,
  ): Promise<ApiKeyDetail>;

  /**
   * Delete an API Key.
   */
  abstract deleteOne(apiKeyID: ApiKeyDetailID): Promise<void>;

  /**
   * Get API Key's corresponding Org.
   */
  abstract getApiKeyOrg(hash: string): Promise<Org | null>;
}
