import type { FeedbackResponse } from '../Feedback/index.js';

/**
 * Read many PMF Survey Response A3 value from API service.
 */
export type ReadManyA3DTO = {
  benefits: Array<{
    id: FeedbackResponse['id'];
    a3: FeedbackResponse['a3'];
  }>;
};
