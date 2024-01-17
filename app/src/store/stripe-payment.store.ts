import { defineStore } from "pinia";
import { loadStripe, type Stripe } from "@stripe/stripe-js";

import { sf } from "simpler-fetch";
import { getAuthHeader, prettyJSON } from "../utils";

import type {
  StripeSetupNext,
  CreateOneStripeSetupNextDTO,
} from "@domain-model";

const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);

/**
 * Type of this pinia store's state.
 */
interface State {
  stripe: Stripe;

  next: null | StripeSetupNext;
}

/**
 * Use this 'store' to manage Stripe Subscriptions.
 */
export const useStripe = defineStore("stripe", {
  state: (): State => {
    if (stripe === null) throw new Error("Failed to initialise Stripe!");

    return { stripe, next: null };
  },

  actions: {
    /**
     * Set `StripeSetupNext` into store locally to tell server what to do next
     * once Stripe's Setup Intent succeeded.
     */
    setStripeSetupNext(next: StripeSetupNext) {
      this.next = next;
    },

    /**
     * Create a Stripe Payment Setup Intent and get back the client secret for
     * the Stripe Elements' payment component.
     */
    async createSetupIntent() {
      const { res, err } = await sf
        .useDefault()
        .POST(`/stripe/setup-intent/create`)
        .bodyJSON<CreateOneStripeSetupNextDTO>({
          // Hardcoded `StripeSetupNext` for now since only this is supported.
          next: { success: { intent: "create-payu-subscription" } },
        })
        .useHeader(getAuthHeader)
        .runJSON<{ clientSecret: string; orgEmail: string }>();

      if (err) return err;
      if (!res.ok)
        return new Error(
          `Failed to create Stripe Setup Intent ${prettyJSON(res)}`
        );

      return res.data;
    },
  },
});
