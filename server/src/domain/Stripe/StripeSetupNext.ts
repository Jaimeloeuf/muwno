/**
 * Base interface of a `StripeSetupNext` object to describe what is the next
 * action the service should do after Stripe SetupIntent has succeeded.
 */
interface StripeSetupNext_Base {
  // what to do next once setup intent is successfully created
  success: {
    intent: string;
  };
}

/**
 * A next action to get service to create a pay as you use subscription after
 * Stripe's SetupIntent has been created successfully.
 */
export interface StripeSetupNext_CreatePayAsYouUseSubscription
  extends StripeSetupNext_Base {
  success: {
    intent: 'create-payu-subscription';
  };
}

/**
 * A next action to get service to create plan subscriptions after Stripe's
 * SetupIntent has been created successfully.
 * This is for creating 2 subscriptions, 1 for base and 1 for overage UBP.
 */
export interface StripeSetupNext_CreateSubscription
  extends StripeSetupNext_Base {
  success: {
    intent: 'create-subscription';
    paymentInterval: 'yearly' | 'monthly';
    coupon: null | string;
  };
}

/**
 * Union type of all possible next actions the service can do.
 */
export type StripeSetupNext =
  | StripeSetupNext_CreatePayAsYouUseSubscription
  | StripeSetupNext_CreateSubscription;
