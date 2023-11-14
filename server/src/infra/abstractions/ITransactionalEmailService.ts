/**
 * Abstract interface for Transactional Email Service.
 * Implement this and use this as the DI key to provide email service.
 */
export abstract class ITransactionalEmailService {
  /**
   * Sends a single transactional email.
   */
  abstract email(
    recipient: string,
    subject: string,
    body: string,
  ): Promise<boolean>;
}
