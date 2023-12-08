import type { Product } from '../Product/index.js';

/**
 * DTO to create a Manual Email Blast
 */
export interface CreateManualEmailBlastDTO {
  customers: Array<{
    email: string;
    name: string | null;
  }>;
  redirectLink: Product['link'];
}
