import type { ISODateTimeString } from "../utils/Timestamp.js";
import type { ProductID } from "../Product/index.js";

/**
 * Type to represent a single Api Key Detail.
 */
export type ApiKeyDetail = {
  /**
   * Unique ID for this Api Key.
   */
  id: string;

  createdAt: ISODateTimeString;

  /**
   * Prefix of the API key for you to easily identify if you have the right key.
   */
  prefix: string;

  /**
   * Optional description for users to describe where the key is used.
   */
  // description: string | null;

  /**
   * ID of the product this API key is made for.
   */
  productID: ProductID;

  /**
   * Name of the API Key creator.
   */
  createdBy: string;
};

/**
 * Type alias for `ApiKeyDetail['id']` where all apiKeyDetailIDs will follow the
 * same type.
 */
export type ApiKeyDetailID = ApiKeyDetail["id"];
