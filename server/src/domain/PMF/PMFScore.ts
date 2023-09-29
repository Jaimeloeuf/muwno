import type { ISODateTimeString } from '../utils/Timestamp.js';

/**
 * Type to represent PMF Score object.
 */
export type PMFScore = {
  /**
   * PMF Score is calculated with survey responses between this time window.
   */
  timeWindow: { start: ISODateTimeString; end: ISODateTimeString };

  /**
   * Votes by each disappointment category.
   */
  votesByCategory: { 1: number; 2: number; 3: number };

  /**
   * Total number of responses for the given time period. Same as the sum of all
   * votes in `votesByCategory`.
   */
  totalResponses: number;

  /**
   * The actual PMF score out of 100 as a percentage of votes for `3`.
   * This will be null if there is no survey responses within the `timeWindow`.
   */
  score: number | null;
};
