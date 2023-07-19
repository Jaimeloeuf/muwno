import type { Product } from "./Product.js";
import type { ISODateTimeString } from "../utils/Timestamp.js";

/**
 * Type to represent a single MIT.
 */
export type MIT = {
  /**
   * Unique ID for this MIT
   */
  id: string;
  productID: Product["id"];
  createdAt: ISODateTimeString;
  task: string;
  done: boolean;
};
