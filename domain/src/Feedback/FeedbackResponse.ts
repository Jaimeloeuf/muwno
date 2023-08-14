import type { ISODateTimeString } from "../utils/Timestamp.js";

/**
 * Type to represent a single response of the PMF survey feedback form.
 */
export interface FeedbackResponse {
  id: number;
  createdAt: ISODateTimeString;
  productID: string;
  a1: number;
  a2: string;
  a3: string;
  a4: string;
}

/**
 * Type alias for `FeedbackResponseID['id']` where all ids will follow the same type.
 */
export type FeedbackResponseID = FeedbackResponse["id"];
