import type { CreateOneCustomerDTO } from './CreateOneCustomerDTO.js';

/**
 * DTO to create many Customer.
 */
export interface CreateManyCustomerDTO {
  /**
   * A list of `CreateOneCustomerDTO`
   */
  customers: Array<CreateOneCustomerDTO>;
}
