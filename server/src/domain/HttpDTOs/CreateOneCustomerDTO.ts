import type { Customer } from '../Customer/index.js';

/**
 * DTO to create a single Customer.
 */
export interface CreateOneCustomerDTO
  extends Omit<Customer, 'id' | 'cid' | 'importedAt' | 'createdAt'> {
  /**
   * `cid` is optional during creation.
   */
  cid: Customer['cid'] | null;

  /**
   * `createdAt` is optional during creation.
   */
  createdAt: Customer['createdAt'] | null;
}
