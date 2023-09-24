/**
 * Utility function to convert integer dollars to Unit Amount type used by Stripe.
 *
 * ## Warning
 * This only works if the smallest unit price is 1 cent. Anything smaller should
 * use `unit_amount_decimal` unit pricing amount
 */
export const dollarsToUnitAmount = (dollars: number) => dollars * 100;
