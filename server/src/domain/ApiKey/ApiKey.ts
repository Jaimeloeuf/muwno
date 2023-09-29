import type { OrgID } from '../Org/index.js';
import type { ISODateTimeString } from '../utils/Timestamp.js';

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
   * ID of the Org that this API Key belongs to.
   */
  orgID: OrgID;

  /**
   * Prefix of the API key for you to easily identify if you have the right key.
   */
  prefix: string;

  /**
   * Creator's name and email as a String.
   * No relation to the User entity itself because deleting a User should not
   * cause the API Key to be deleted.
   */
  createdBy: string;

  /**
   * Optional description for users to describe where the key is used.
   */
  description: string | null;
};

/**
 * Type alias for `ApiKeyDetail['id']` where all apiKeyDetailIDs will follow the
 * same type.
 */
export type ApiKeyDetailID = ApiKeyDetail['id'];
