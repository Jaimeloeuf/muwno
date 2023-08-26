/**
 * Utility function to convert integer dollars to Unit Amount type used by Stripe.
 */
export const dollarsToUnitAmount = (dollars: number) => dollars * 100;
