import type { ISODateTimeString } from '../../utils/Timestamp.js';

/**
 * Type to represent Survey Details object for the Automatic survey mode.
 *
 * this should be moved to survey/
 * where it houses all the survey methods types
 */
export type AutoSurveyDetails = {
  /**
   * What day should the first automatic email survey blast be sent out?
   *
   * All future automatic surveying dates will use this as the starting date for
   * reference when calculating everything else.
   */
  start: ISODateTimeString;

  /**
   * How many weeks between each survey email blast.
   */
  rate: number;

  /**
   * What percentage of your customer's to survey each time.
   *
   * @todo
   * Should this be a fixed value instead of percent so the number we sample
   * dont change over time when user's customer count changes.
   */
  size: number;

  /**
   * Maximum number of a time a customer can be surveyed across all time.
   */
  maxSurveyCount: number;

  /**
   * How long (in weeks) before a customer can be surveyed again with a email
   * blast after they have been last surveyed, assuming `maxSurveyCount` is 1.
   */
  coolOff: number;
};
