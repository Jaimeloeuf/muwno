import type { StripeSetupNext } from "../Stripe/index.js";

/**
 * DTO to hold data for creating a single StripeSetupNext action.
 */
export type CreateOneStripeSetupNextDTO = {
  next: null | StripeSetupNext;
};
