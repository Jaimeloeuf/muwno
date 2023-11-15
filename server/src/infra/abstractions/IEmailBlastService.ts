/**
 * Abstract interface for Service used to send out Email Blasts.
 * Implement this and use this as the DI key to provide email service.
 */
export abstract class IEmailBlastService {
  /**
   * Sends a batch of emails.
   * Returns boolean to indicate if method succeeded.
   */
  abstract sendBatch(
    emailMessages: Array<{ to: string; subject: string; body: string }>,
  ): Promise<boolean>;
}
