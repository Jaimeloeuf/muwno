import type { Org, Products } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Product` Entity objects regardless of the underlying datasource.
 */
export abstract class IProductRepo {
  /**
   * Get all products of an Org.
   */
  abstract getOrgProducts(orgID: Org['id']): Promise<Products>;
}
