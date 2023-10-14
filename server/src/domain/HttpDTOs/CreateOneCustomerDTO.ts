import type { Customer } from '../Customer/index.js';

/**
 * DTO to create a single Customer.
 */
export interface CreateOneCustomerDTO
  extends Omit<Customer, 'id' | 'cid' | 'importedAt'> {
  /**
   * `cid` is optional during creation.
   */
  cid: string | null;
}
