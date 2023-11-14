import { OrgID } from 'domain-model';

type AdminNotificationWebhookPaymentDetails = {
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
 * Notify admin about a successful Stripe Webhook payment.
 */
export const stripeWebhookPaidNotifBuilder = (
  details: AdminNotificationWebhookPaymentDetails,
) => `<b>Paid!</b>

${details.customerName} paid ${details.currency} ${(
  details.amountPaid / 100
).toFixed(2)}

Invoice: ${details.invoiceUrl}

OrgID: ${details.orgID}
StripeCustomerID: ${details.stripeCustomerID}
For: ${details.subscriptionID}`;

/**
 * Notify admin about a failed Stripe Webhook payment.
 */
export const stripeWebhookPaymentFailedNotifBuilder = (
  details: AdminNotificationWebhookPaymentDetails,
) => `<b>Payment Failed!</b>

${details.customerName} failed to pay ${details.currency} ${(
  details.amountPaid / 100
).toFixed(2)}

Invoice: ${details.invoiceUrl}

OrgID: ${details.orgID}
StripeCustomerID: ${details.stripeCustomerID}
For: ${details.subscriptionID}`;
