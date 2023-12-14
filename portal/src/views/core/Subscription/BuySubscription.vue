<script setup lang="ts">
import { useRouter } from "vue-router";
import { useLoader, useStripe } from "../../../store";
import { SetupPaymentMethodRoute, OnboardingRoute } from "../../../router";
import Accordion from "../../shared/Accordion.vue";
import TopNavbar from "../../shared/TopNavbar.vue";
import {
  numberFormatter,
  smallMoneyFormatter,
} from "../../../utils/numericalFormatter";
import { flags } from "../../../utils/flags";
import { PlanDetails } from "@domain-model";

const loader = useLoader();
const router = useRouter();
const stripeStore = useStripe();

async function buyPlan(paymentInterval: "yearly" | "monthly") {
  loader.show("Waiting for payment provider...");

  // Create subscription after payment method has been successfully setup.
  stripeStore.setStripeSetupNext({
    success: {
      intent: "create-subscription",
      paymentInterval,

      // Coupon is hardcoded to always be null for now because there will be no
      // coupon support after fully transitioning to pay as you go pricing only.
      coupon: null,
    },
  });

  router.push({ name: SetupPaymentMethodRoute.name });

  loader.hide();
}
</script>

<template>
  <div>
    <TopNavbar back :backRoute="{ name: OnboardingRoute.name }">
      Buy Subscription Plan
    </TopNavbar>

    <div
      class="mx-auto flex max-w-screen-xl flex-col justify-between gap-6 pt-2 lg:flex-row lg:gap-12 lg:pt-6"
    >
      <div class="w-full font-light">
        <p class="pb-4 text-5xl font-bold text-zinc-700">
          Simple, Honest Pricing
        </p>

        <p class="pb-10 text-xl">
          Get started for
          <span class="rounded-lg bg-yellow-300 px-2 font-medium">FREE</span>
          and only pay what you use over the free tier.
          <br />
          No hidden fees.
        </p>

        <Accordion class="pb-2" defaultState="show">
          <template #summary>
            <p class="text-left text-xl font-normal">
              Monthly free tier includes
            </p>
          </template>

          <template #content>
            <div class="pb-4">
              <p class="pb-1 font-normal">Usage</p>
              <ul class="list-decimal px-5 text-lg">
                <li>
                  {{ numberFormatter(PlanDetails.included.response) }}
                  Survey responses
                </li>
                <li>
                  {{ numberFormatter(PlanDetails.included.email) }}
                  Survey emails
                </li>
              </ul>
            </div>

            <div>
              <p class="pb-1 font-normal">Storage</p>
              <ul class="mb-4 list-decimal px-5 text-lg">
                <li>
                  {{ numberFormatter(PlanDetails.included.responseStored) }}
                  Responses stored
                </li>
                <li v-if="flags.devMode">
                  {{ numberFormatter(PlanDetails.included.customerStored) }}
                  Customers stored
                </li>
              </ul>
            </div>
          </template>
        </Accordion>

        <Accordion class="pb-12" defaultState="hide">
          <template #summary>
            <p class="text-left text-xl font-normal">After the free tier</p>
          </template>

          <template #content>
            <div class="pb-4">
              <p class="pb-1 font-normal">Usage</p>
              <ul class="list-decimal px-5 text-lg">
                <li>
                  {{
                    smallMoneyFormatter(PlanDetails.overage.response.price.SGD)
                  }}
                  / Survey response
                </li>
                <li>
                  {{ smallMoneyFormatter(PlanDetails.overage.email.price.SGD) }}
                  / Survey email
                </li>
              </ul>
            </div>

            <div>
              <p class="pb-1 font-normal">Storage</p>
              <ul class="list-decimal px-5 text-lg">
                <li>
                  {{
                    smallMoneyFormatter(
                      PlanDetails.overage.responseStored.price.SGD
                    )
                  }}
                  / Survey response stored
                </li>
                <li v-if="flags.devMode">
                  {{
                    smallMoneyFormatter(
                      PlanDetails.overage.customerStored.price.SGD
                    )
                  }}
                  / Customer stored
                </li>
              </ul>
            </div>
          </template>
        </Accordion>

        <div>
          <p class="text-xl font-normal">Need Help?</p>
          <p>
            Email us at
            <a
              class="italic underline decoration-zinc-300 underline-offset-4"
              target="_blank"
              href="mailto:help@muwno.com"
            >
              help@muwno.com
            </a>
          </p>
          <p>
            Volume and startup discounts available, email
            <a
              class="italic underline decoration-zinc-200 underline-offset-4"
              target="_blank"
              href="mailto:help@muwno.com"
            >
              help@muwno.com
            </a>
            for details.
          </p>
        </div>
      </div>

      <div class="flex w-full flex-col justify-center gap-1 font-light">
        <p class="text-lg">
          Your payment details is needed for verification and future payment.
        </p>

        <div
          class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-green-600 p-6 shadow hover:shadow-2xl"
          @click="buyPlan('yearly')"
        >
          <div>
            <p class="py-2 align-middle text-5xl text-green-700 lg:py-8">
              Start
            </p>
          </div>

          <svg
            class="w-10 text-green-700"
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
    </div>
  </div>
</template>
