import type { Org } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Org` Entity objects regardless of the underlying datasource.
 */
export abstract class IOrgRepo {
  /**
   * Get a single Org Entity object back
   */
  abstract getOne(orgID: Org['id']): Promise<Org | null>;
}
