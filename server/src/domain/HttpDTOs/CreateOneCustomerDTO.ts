import type { Customer } from '../Customer/index.js';

/**
 * DTO to create a single Customer.
 */
export type CreateOneCustomerDTO = Omit<Customer, 'id' | 'createdAt'>;
