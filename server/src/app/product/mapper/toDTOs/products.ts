import type { Products, ReadManyProductDTO } from 'domain-model';

/**
 * Map many Product Entity objects to Read Many Product DTO
 */
export const mapManyProductEntityToDTO = (
  products: Products,
): ReadManyProductDTO => ({ products });
