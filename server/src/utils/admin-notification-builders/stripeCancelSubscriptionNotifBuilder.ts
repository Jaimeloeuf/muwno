/**
 * Notify admin about a customer cancelling their subscription.
 */
export const stripeCancelSubscriptionNotifBuilder = (
  headerMessage: string,
  details: Array<[string, string | number | null | boolean]>,
) =>
  `<b>${headerMessage}</b>

` +
  details
    .map(
      ([property, value]) => `${property}: ${value}
`,
    )
    .join('');
