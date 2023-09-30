/**
 * Abstract interface for Transactional Email Service.
 * Implement this and use this as the DI key to provide email service.
 */
export abstract class ITransactionalEmailService {
  /**
   * Sends transactional email to invite someone to join a Team/Org.
   * Returns boolean to indicate if method succeeded.
   */
  abstract teamInvite(
    recipientEmail: string,
    inviterName: string,
    orgName: string,
  ): Promise<boolean>;

  /**
   * Sends transactional email to welcome user to the product.
   * Returns boolean to indicate if method succeeded.
   */
  abstract welcomeNewUser(
    recipientEmail: string,
    name: string,
  ): Promise<boolean>;

  /**
   * Sends transactional email to thank user for creating an Org and to tell
   * them about any next steps for them.
   * Returns boolean to indicate if method succeeded.
   */
  abstract newOrgCreated(
    recipientEmail: string,
    orgName: string,
  ): Promise<boolean>;
}
