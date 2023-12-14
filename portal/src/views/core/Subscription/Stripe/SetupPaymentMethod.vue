<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { StripeElements } from "@stripe/stripe-js";
import { sf } from "simpler-fetch";
import { useStripe, useLoader, useError } from "../../../../store";
import { SetupSuccessPaymentRoute } from "../../../../router";
import { getAbsoluteUrlFromRoute } from "../../../../utils/getAbsoluteUrlFromRoute";

const stripeStore = useStripe();
const loader = useLoader();
const errorStore = useError();

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

async function setupPaymentMethod() {
  if (elements.value === null)
    throw new Error("Stripe Elements is not setup and cannot be used.");

  loader.show(
    "Do not close this window! Waiting for Stripe to verify and confirm your payment details!"
  );

  // Trigger form validation and wallet collection
  const { error: submitError } = await elements.value.submit();
  if (submitError) {
    loader.hide();
    errorStore.newError(JSON.stringify(submitError));
    return;
  }

  // Create the SetupIntent and obtain clientSecret
  const { clientSecret } = await stripeStore.createSetupIntent();

  /** Redirect to this route on setup success */
  const redirectTo = encodeURIComponent(
    getAbsoluteUrlFromRoute({ name: SetupSuccessPaymentRoute.name })
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
          `/stripe/setup-intent/redirect-on-confirmation?redirectTo=${redirectTo}`
        )
        .getUrl(),
    },
  });

  loader.hide();

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // `return_url` set in `confirmPayment` method. For some payment methods like
  // iDEAL, your customer will be redirected to an intermediate site first to
  // authorize payment before being redirected to the `return_url`.
  errorStore.newError(JSON.stringify(error));
}
</script>

<template>
  <div class="mx-auto w-full max-w-lg">
    <div class="pb-6">
      <p class="text-4xl font-light">Setup Payment</p>
      <p class="text-sm">
        Secured with
        <a
          class="underline decoration-zinc-400"
          href="https://stripe.com/billing"
          target="_blank"
        >
          Stripe Billing
        </a>
      </p>
    </div>

    <p class="pb-10 font-extralight">
      Payment method is required for verification and future payments only. You
      will not be charged today.
    </p>

    <!-- Stripe renders its dynamic payment info form here -->
    <div ref="paymentElement" class="pb-12"></div>

    <div
      class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-green-600 p-6 shadow hover:shadow-2xl"
      @click="setupPaymentMethod"
    >
      <p class="align-middle text-2xl text-green-600">Setup</p>

      <svg
        class="w-10 text-green-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 10"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M1 5h12m0 0L9 1m4 4L9 9"
        />
      </svg>
    </div>
  </div>
</template>
