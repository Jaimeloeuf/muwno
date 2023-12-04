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

  /**
   * Product's link where users will be redirected to by default after
   * completing any surveys associated with this product.
   */
  link: string | null;

  /**
   * Internal description of the product to help users distinguish between
   * multiple products of the same name.
   */
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
