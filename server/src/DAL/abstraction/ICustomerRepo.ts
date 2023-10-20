import type { Customer, OrgID } from 'domain-model';

export type DBCreateOneCustomerDTO = Omit<Customer, 'importedAt'>;

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Customer` Entity objects regardless of the underlying datasource.
 */
export abstract class ICustomerRepo {
  /**
   * Add a new Customer to data source.
   *
   * @todo Make sure this is idempotent for the same user with upsert or smth
   */
  abstract newOne(
    orgID: OrgID,
    customer: DBCreateOneCustomerDTO,
  ): Promise<void>;

  /**
   * Get the number of Customers currently stored by a given Org.
   */
  abstract count(orgID: OrgID): Promise<number>;
}
