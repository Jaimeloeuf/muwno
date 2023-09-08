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
 * A next action to get service to create plan subscriptions after Stripe's
 * SetupIntent has been created successfully.
 */
export interface StripeSetupNext_CreateSubscription
  extends StripeSetupNext_Base {
  success: {
    intent: "create-subscription";
    paymentInterval: "yearly" | "monthly";
  };
}

/**
 * Union type of all possible next actions the service can do.
 */
export type StripeSetupNext = StripeSetupNext_CreateSubscription;
