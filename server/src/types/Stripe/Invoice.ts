import type { Customer } from './Customer.js';

export type Invoice = {
  /**
   * This is Stripe Invoice ID
   */
  id: string;

  /**
   * This is Stripe's Customer ID, **NOT** `UserID` or `OrgID`
   */
  customer: Customer['id'];

  /**
   * Stripe Customer Email, this should be `Org['email']` unless customer
   * changes it manually in Stripe Customer Billing Portal, since this is set
   * for them when creating the Stripe Customer.
   */
  customer_email: string;

  /**
   * Stripe's Subscription ID.
   */
  subscription: string;

  /**
   * String reason from Stripe on why the customer is invoiced.
   */
  billing_reason: string;

  /**
   * URL for the invoice.
   */
  hosted_invoice_url: string;

  /**
   * URL for the invoice PDF.
   */
  invoice_pdf: string;
};
