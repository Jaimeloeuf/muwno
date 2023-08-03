import type { Org, CreateOneOrgDTO, UserID } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Org` Entity objects regardless of the underlying datasource.
 */
export abstract class IOrgRepo {
  /**
   * Get a single Org Entity object back
   */
  abstract getOne(orgID: Org['id']): Promise<Org | null>;

  /**
   * Get a user's Org Entity object back if they belong to an Org
   */
  abstract getUserOrg(userID: UserID): Promise<Org | null>;

  /**
   * Create a new Organisation in data source
   */
  abstract createOne(createOneOrgDTO: CreateOneOrgDTO): Promise<Org>;
}
