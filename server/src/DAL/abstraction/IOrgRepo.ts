import type { Org, OrgID, CreateOneOrgDTO, UserID } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Org` Entity objects regardless of the underlying datasource.
 */
export abstract class IOrgRepo {
  /**
   * Check if user have access permission to this Org.
   */
  abstract canUserAccessOrg(userID: UserID, orgID: OrgID): Promise<boolean>;

  /**
   * Get a single Org Entity object back
   */
  abstract getOne(orgID: OrgID): Promise<Org | null>;

  /**
   * Get a user's Org Entity object back if they belong to an Org
   */
  abstract getUserOrg(userID: UserID): Promise<Org | null>;

  /**
   * Create a new Organisation in data source
   */
  abstract createOne(
    id: string,
    createOneOrgDTO: CreateOneOrgDTO,
  ): Promise<Org>;

  /**
   * Update an Organisation in data source
   */
  abstract updateOne(
    id: string,
    createOneOrgDTO: CreateOneOrgDTO,
  ): Promise<Org>;
}
