import type { Product } from '../Product/index.js';

/**
 * DTO data used to create a single Product.
 */
export type CreateOneProductDTO = {
  name: Product['name'];
  link: Product['link'];
  description: Product['description'];
};
