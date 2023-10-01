import type { CreateOneContactFormSubmissionDTO } from 'domain-model';

/**
 * Abstract interface for a Admin Notification Service, to notify admins through
 * whatever channel necessary.
 * Implement this and use this as the DI key.
 */
export abstract class IAdminNotifService {
  /**
   * Notify admin about a landing page contact form submission.
   * Returns boolean to indicate if method succeeded.
   */
  abstract landingPageContactForm(
    details: CreateOneContactFormSubmissionDTO,
  ): Promise<boolean>;
}
