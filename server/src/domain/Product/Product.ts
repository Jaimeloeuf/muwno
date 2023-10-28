import type { ISODateTimeString } from '../utils/Timestamp.js';

/**
 * Type to represent a single Product.
 */
export type Product = {
  /**
   * Unique ID for this product
   */
  id: string;
  createdAt: ISODateTimeString;
  name: string;
  description: string;
};

/**
 * Type alias for `Product['id']` where all productIDs will follow the same type.
 */
export type ProductID = Product['id'];

/**
 * Type to represent a Mapping of Products of a single organisation.
 */
export type Products = Record<ProductID, Product>;
