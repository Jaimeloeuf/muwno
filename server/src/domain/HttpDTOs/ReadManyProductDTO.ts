import type { Products } from '../Product/index.js';

/**
 * Read many Product from API service.
 */
export type ReadManyProductDTO = {
  products: Products;
};
