import type { ISODateTimeString } from "../utils/Timestamp.js";

/**
 * Type to represent PMF Live Score.
 */
export type PMFLiveScore = {
  startOfSprintWindow: ISODateTimeString;
  votesByCategory: { 1: number; 2: number; 3: number };
  totalResponses: number;
  currentPMFScore: number;
};
