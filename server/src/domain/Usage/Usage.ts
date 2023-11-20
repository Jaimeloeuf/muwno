// import type { ProductID } from '../Product/index.js';
import type { ISODateTimeString } from '../utils/Timestamp.js';

/**
 * Type to represent a single Usage stat.
 */
export type Usage = {
  /**
   * Start of time range.
   */
  from: ISODateTimeString;

  /**
   * End of time range.
   */
  to: ISODateTimeString;

  /**
   * Number of usage events recorded for the `response` event in the given time
   * range. Could be null if no valid data can be retrieved.
   */
  response: number | null;

  /**
   * Number of usage events recorded for the `emailsSent` event in the given
   * time range. Could be null if no valid data can be retrieved.
   */
  emailsSent: number | null;

  /**
   * Number of Survey Responses currently stored. Could be null if no valid data
   * can be retrieved.
   */
  responseStored: number | null;
};
