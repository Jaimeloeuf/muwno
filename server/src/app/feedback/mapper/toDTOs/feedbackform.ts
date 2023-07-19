import type { FeedbackForm, ReadOneFeedbackFormDTO } from 'domain-model';

/**
 * Map a single FeedbackForm Entity object to Read One FeedbackForm DTO
 */
export const mapFeedbackFormEntityToDTO = (
  form: FeedbackForm,
): ReadOneFeedbackFormDTO => ({ form });
