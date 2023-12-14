<script setup lang="ts">
import { useRouter } from "vue-router";
import { useLoader, useStripe } from "../../../store";
import { SetupPaymentMethodRoute, OnboardingRoute } from "../../../router";
import Accordion from "../../shared/Accordion.vue";
import TopNavbar from "../../shared/TopNavbar.vue";
import {
  numberFormatter,
  normalMoneyFormatter,
  smallMoneyFormatter,
} from "../../../utils/numericalFormatter";
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
        <p class="pb-6 text-xl">
          Our subscription charges you a <i>base price</i> plus any
          <i>extra usage</i> over what is included. Just like a telco
          subscription!
        </p>

        <Accordion class="pb-2" defaultState="show">
          <template #summary>
            <p class="text-left text-xl font-normal">
              What is included every month?
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
                  Emails sent
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
                <li>
                  {{ numberFormatter(PlanDetails.included.customerStored) }}
                  Customers stored
                </li>
              </ul>
            </div>
          </template>
        </Accordion>

        <Accordion class="pb-8">
          <template #summary>
            <p class="text-left text-xl font-normal">
              How much does it cost if I use more than what is included?
            </p>
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
                  / Email sent
                </li>
              </ul>
            </div>

            <div>
              <p class="pb-1 font-normal">Storage</p>
              <ul class="mb-4 list-decimal px-5 text-lg">
                <li>
                  {{
                    smallMoneyFormatter(
                      PlanDetails.overage.responseStored.price.SGD
                    )
                  }}
                  / Survey response stored
                </li>
                <li>
                  {{
                    smallMoneyFormatter(
                      PlanDetails.overage.customerStored.price.SGD
                    )
                  }}
                  / Customer stored
                </li>
              </ul>
            </div>

            <p class="pt-4 font-thin italic">
              Overage is billed monthly even if you pay for the base
              subscription yearly.
            </p>
            <p class="pt-1 font-thin italic">
              Volume discount is available, email
              <a
                class="italic underline decoration-zinc-200 underline-offset-4"
                target="_blank"
                href="mailto:help@muwno.com"
              >
                help@muwno.com
              </a>
              for more details.
            </p>
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
        </div>
      </div>

      <div class="flex w-full flex-col gap-6 font-light">
        <div
          class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-green-600 p-6 shadow hover:shadow-2xl"
          @click="buyPlan('yearly')"
        >
          <div>
            <p class="pb-2 text-green-700">Paid Yearly</p>
            <p class="pb-1 text-3xl text-green-700">
              {{ normalMoneyFormatter(PlanDetails.price.SGD.yearly / 12) }} /
              <b>Month</b>
            </p>
            <p class="pb-4 font-extralight">+ Overage</p>

            <p>
              Save
              <span class="text-green-700">
                {{
                  normalMoneyFormatter(
                    PlanDetails.price.SGD.monthly * 12 -
                      PlanDetails.price.SGD.yearly
                  )
                }}
              </span>
              by paying
              {{ normalMoneyFormatter(PlanDetails.price.SGD.yearly) }} once a
              year.
            </p>
          </div>

          <svg
            class="h-8 w-8 text-green-700"
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

        <div
          class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-zinc-200 p-6 hover:shadow-2xl"
          @click="buyPlan('monthly')"
        >
          <div>
            <p class="pb-1 text-2xl font-extralight">
              {{ normalMoneyFormatter(PlanDetails.price.SGD.monthly) }} / Month
            </p>
            <p class="pb-4 font-extralight">+ Overage</p>

            <p>
              Save
              <span class="text-green-700">
                {{
                  normalMoneyFormatter(
                    PlanDetails.price.SGD.monthly * 12 -
                      PlanDetails.price.SGD.yearly
                  )
                }}
              </span>
              <span class="text-sm"> (2 months free)</span> by paying once a
              year instead.
            </p>
          </div>

          <svg
            class="h-8 w-8 text-zinc-500"
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
