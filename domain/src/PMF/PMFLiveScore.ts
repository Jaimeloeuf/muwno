import type { ISODateTimeString } from "../utils/Timestamp.js";

/**
 * Type to represent PMF Live Score.
 */
export type PMFLiveScore = {
  startOfSprintWindow: ISODateTimeString;
  votesByCategory: [number, number, number];
  totalResponses: number;
  currentPMFScore: number;
};
