import type { ISODateTimeString } from "../utils/Timestamp.js";

/**
 * Type to represent PMF Score object.
 */
export type PMFScore = {
  timeWindow: { start: ISODateTimeString; end: ISODateTimeString };
  votesByCategory: { 1: number; 2: number; 3: number };
  totalResponses: number;
  score: number;
};
