import type { ISODateTimeString } from "../utils/Timestamp.js";

/**
 * Type to represent PMF Live Score.
 */
export type PMFLiveScore = {
  /**
   * PMF Score is calculated with this as the start of the sprint window.
   */
  startOfSprintWindow: ISODateTimeString;

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
   */
  currentPMFScore: number;
};
