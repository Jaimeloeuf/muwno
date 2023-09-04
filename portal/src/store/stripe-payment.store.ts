import { defineStore } from "pinia";
import { loadStripe, type Stripe } from "@stripe/stripe-js";

import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";

const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);

/**
 * Type of this pinia store's state.
 */
interface State {
  stripe: Stripe;
}

/**
 * Use this 'store' to manage Stripe Subscriptions.
 */
export const useStripe = defineStore("stripe", {
  state: (): State => {
    if (stripe === null) throw new Error("Failed to initialise Stripe!");

    return { stripe };
  },

  actions: {
    /**
     * Create a Stripe Payment Setup Intent and get back the client secret for
     * the Stripe Elements' payment component.
     */
    async createSetupIntent() {
      const { res, err } = await sf
        .useDefault()
        .POST(`/subscription/stripe/create-setup-intent`)
        .useHeader(getAuthHeader)
        .runJSON<{ clientSecret: string; orgEmail: string }>();

      if (err) throw err;
      if (!res.ok)
        throw new Error(
          `Failed to create Stripe Setup Intent ${JSON.stringify(res)}`
        );

      return res.data;
    },
  },
});

// Fetches the payment intent status after payment submission
// @todo since payment success will cause redirect to `return_url`
// this should be ran there instead of here....
async function checkStatus(clientSecret: string) {
  // Both of these will be included as URL Query params in the return_url
  // so we can parse it from that
  // payment_intent=
  // payment_intent_client_secret=

  if (clientSecret === undefined)
    throw new Error(`Missing Stripe Payment Intent Client Secret.`);

  const { paymentIntent } = await (stripe as Stripe).retrievePaymentIntent(
    clientSecret
  );

  if (paymentIntent === undefined)
    throw new Error("Failed to fetch Stripe Payment Intent");

  switch (paymentIntent.status) {
    case "succeeded":
      console.log("Payment succeeded!");
      break;
    case "processing":
      console.log("Your payment is processing.");
      break;
    case "requires_payment_method":
      console.log("Your payment was not successful, please try again.");
      break;
    default:
      console.log("Something went wrong.");
      break;
  }
}
