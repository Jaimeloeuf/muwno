import type { ISODateTimeString } from '../utils/Timestamp.js';

/**
 * Type to represent a single response of the PMF survey feedback form.
 */
export interface FeedbackResponse {
  id: string;
  createdAt: ISODateTimeString;
  productID: string;

  /**
   * Answer for question, "How would you feel if PRODUCT no longer exists?"
   */
  a1: 1 | 2 | 3;

  /**
   * Answer for question, "What type of people do you think would most benefit
   * from PRODUCT?"
   */
  a2: string;

  /**
   * Answer for question, "What is the main benefit you receive from PRODUCT?"
   */
  a3: string;

  /**
   * Answer for question, "How can we improve PRODUCT for you?"
   */
  a4: string;
}

/**
 * Type alias for `FeedbackResponseID['id']` where all ids will follow the same type.
 */
export type FeedbackResponseID = FeedbackResponse['id'];
