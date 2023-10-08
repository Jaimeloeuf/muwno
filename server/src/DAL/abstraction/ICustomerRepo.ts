import type { Customer, OrgID } from 'domain-model';

export type DBCreateOneCustomerDTO = Omit<Customer, 'createdAt'>;

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Customer` Entity objects regardless of the underlying datasource.
 */
export abstract class ICustomerRepo {
  /**
   * Add a new Customer to data source.
   */
  abstract newOne(
    orgID: OrgID,
    customer: DBCreateOneCustomerDTO,
  ): Promise<void>;
}
