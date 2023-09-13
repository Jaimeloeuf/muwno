<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { StripeElements } from "@stripe/stripe-js";
import { sf } from "simpler-fetch";
import { useStripe, useLoader } from "../../../../store";
import { SetupSuccessPaymentRoute } from "../../../../router";
import { getAbsoluteUrlFromRoute } from "../../../../utils/getAbsoluteUrlFromRoute";

const router = useRouter();
const stripeStore = useStripe();
const loader = useLoader();

const stripe = stripeStore.stripe;

// Create ref to hold element reference, name must match template ref value
const paymentElement = ref<HTMLInputElement | null>(null);
const elements = ref<StripeElements | null>(null);

// Mount the Stripe Payment Form after the vue component is mounted.
onMounted(async function mountStripePaymentForm() {
  if (paymentElement.value === null)
    throw new Error("Payment DOM Element is not mounted.");

  elements.value = stripe.elements({
    mode: "setup",

    // @todo might change this
    currency: "sgd",
  });

  elements.value
    .create("payment", {
      // defaultValues: {
      //   // @todo
      //   billingDetails: { email: "" },
      // },

      // @todo Not sure if this is supported
      wallets: {
        applePay: "auto",
        googlePay: "auto",
      },
    })
    .mount(paymentElement.value);
});

async function pay() {
  if (elements.value === null)
    throw new Error("Stripe Elements is not setup and cannot be used.");

  loader.show(
    "Do not close this window! Waiting for Stripe to verify and confirm your payment details!"
  );

  // Trigger form validation and wallet collection
  const { error: submitError } = await elements.value.submit();
  if (submitError) {
    console.error(submitError);
    return;
  }

  // Create the SetupIntent and obtain clientSecret
  const { clientSecret } = await stripeStore.createSetupIntent();

  /** Redirect to this route on setup success */
  const redirectTo = encodeURIComponent(
    getAbsoluteUrlFromRoute(SetupSuccessPaymentRoute.name)
  );

  // Confirm the SetupIntent using the details collected by the Payment Element
  const { error } = await stripe.confirmSetup({
    elements: elements.value,
    clientSecret,
    confirmParams: {
      // User's browser will make a GET request here, which will trigger next steps
      return_url: sf
        .useDefault()
        .GET(
          `/subscription/stripe/redirect/setup-intent-confirmed?redirectTo=${redirectTo}`
        )
        .getURL(),
    },
  });

  loader.hide();

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // `return_url` set in `confirmPayment` method. For some payment methods like
  // iDEAL, your customer will be redirected to an intermediate site first to
  // authorize payment before being redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    console.error(error);

    // @todo stripe say can display this to user directly
    error.message;

    // log this to logging infra for debugging
    error.doc_url;
  }

  // @todo Handle other error types and let customer retry
  else {
    // error.type === "invalid_request_error"
    // ^ could be due to an invalid request or 3DS authentication failures.

    console.log("An unexpected error occurred.");
    console.error(error);
  }
}
</script>

<template>
  <div class="mx-auto max-w-lg">
    <div class="mb-6 flex flex-row items-center justify-between">
      <div>
        <p class="text-4xl font-light">Payment</p>
        <p class="text-xs">Secured with Stripe Billing</p>
      </div>

      <button
        class="rounded-lg bg-slate-400 px-2 py-0.5 text-white"
        @click="router.back"
      >
        cancel
      </button>
    </div>

    <div class="mb-6 font-extralight">
      <p>Set up a default payment method and pay for the subscription.</p>
    </div>

    <div>
      <!-- @todo Show user total amount billed today -->
    </div>

    <!-- Stripe renders its dynamic payment info form here -->
    <div ref="paymentElement" class="mb-12"></div>

    <button
      class="mb-8 w-full rounded-lg bg-green-600 p-2 text-2xl text-white"
      @click="pay"
    >
      Pay
    </button>
  </div>
</template>
