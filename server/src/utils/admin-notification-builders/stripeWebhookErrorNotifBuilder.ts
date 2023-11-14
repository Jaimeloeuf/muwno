/**
 * Notify admin about an unexpected Stripe Webhook Error.
 */
export const stripeWebhookErrorNotifBuilder = (
  errMsg: string,
  error: Error,
) => `<b>Stripe Webhook Error</b>

${errMsg}

${error}`;
