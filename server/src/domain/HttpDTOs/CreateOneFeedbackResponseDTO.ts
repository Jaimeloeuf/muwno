import type { FeedbackResponse } from '../Feedback/index.js';

/**
 * DTO to hold data for creating a single Feedback Form Response.
 */
export type CreateOneFeedbackResponseDTO = Omit<
  FeedbackResponse,
  'id' | 'createdAt' | 'productID'
>;
