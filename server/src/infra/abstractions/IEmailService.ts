/**
 * Email Object containing all the fields for constructing an email
 */
export type EmailObject = {
  from: string;
  subject: string;
  textBody: string;
};

/**
 * Abstract interface for an Email Service.
 * Implement this and use this as the DI key to provide email service.
 */
export abstract class IEmailService {
  /**
   * Send ONE email to ONE recipient.
   *
   * Returns boolean to indicate if method succeeded.
   */
  abstract sendOne(
    recipient: string,
    emailObject: EmailObject,
  ): Promise<boolean>;

  /**
   * Send ONE email to MANY recipients.
   *
   * Returns boolean to indicate if method succeeded.
   * All individual emails must succeed for this to succeed.
   */
  abstract sendMany(
    recipients: Array<string>,
    emailObject: EmailObject,
  ): Promise<boolean>;
}
