import type { Product } from '../Product/index.js';

/**
 * Type to represent dynamic data of the PMF survey feedback form.
 */
export interface FeedbackForm {
  productName: string;
  redirectLink: Product['link'];
}
