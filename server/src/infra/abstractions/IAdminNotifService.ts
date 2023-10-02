import type {
  CreateOneContactFormSubmissionDTO,
  OrgID,
  CreateOneOrgDTO,
} from 'domain-model';

export type AdminNotificationWebhookPaymentDetails = {
  customerName: string;
  amountPaid: number;
  currency: string;
  orgID: OrgID;
  stripeCustomerID: string;
  customerEmail: string;
  customerPhone: string;
  subscriptionID: string;
  invoiceUrl: string;
};

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

  /**
   * Notify admin about a new User signup.
   * Returns boolean to indicate if method succeeded.
   */
  abstract userSignup(
    name: string,
    email: string,
    phone?: string,
  ): Promise<boolean>;

  /**
   * Notify admin about a new Org created.
   * Returns boolean to indicate if method succeeded.
   */
  abstract orgCreated(
    orgID: OrgID,
    createOneOrgDTO: CreateOneOrgDTO,
  ): Promise<boolean>;

  /**
   * Notify admin about an unexpected Webhook Error.
   * Returns boolean to indicate if method succeeded.
   */
  abstract webhookError(errMsg: string, error: Error): Promise<boolean>;

  /**
   * Notify admin about a successful Webhook payment.
   * Returns boolean to indicate if method succeeded.
   */
  abstract webhookPaid(
    details: AdminNotificationWebhookPaymentDetails,
  ): Promise<boolean>;

  /**
   * Notify admin about a failed Webhook payment.
   * Returns boolean to indicate if method succeeded.
   */
  abstract webhookPaymentFailed(
    details: AdminNotificationWebhookPaymentDetails,
  ): Promise<boolean>;

  /**
   * Notify admin with a custom message.
   * Returns boolean to indicate if method succeeded.
   */
  abstract custom(msg: string): Promise<boolean>;
}
