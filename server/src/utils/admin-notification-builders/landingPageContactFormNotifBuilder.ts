import type { CreateOneContactFormSubmissionDTO } from 'domain-model';

/**
 * Notify admin about a landing page contact form submission.
 */
export const landingPageContactFormNotifBuilder = (
  details: CreateOneContactFormSubmissionDTO,
) => `<b>Landing page Contact Form</b>

Name: ${details.name}
Email: ${details.email}
Message: ${details.message}`;
