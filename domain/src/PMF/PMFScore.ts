import type { ISODateTimeString } from "../utils/Timestamp.js";

/**
 * Type to represent PMF Score object.
 */
export type PMFScore = {
  timeWindow: { start: ISODateTimeString; end: ISODateTimeString };
  votesByCategory: [number, number, number];
  totalResponses: number;
  score: number;
};
