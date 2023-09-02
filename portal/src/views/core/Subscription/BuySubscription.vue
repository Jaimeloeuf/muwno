<script setup lang="ts">
import { useRouter } from "vue-router";
import { useLoader, useStripe } from "../../../store";
import { CollectPaymentInfoRoute } from "../../../router";
import { PlanDetails } from "./PlanDetails";

const loader = useLoader();
const router = useRouter();
const stripeStore = useStripe();

const numberFormatter = Intl.NumberFormat().format;
const moneyFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "SGD",
}).format;

async function buyPlan(paymentInterval: "yearly" | "monthly") {
  loader.show();

  await stripeStore.createSubscription(paymentInterval);

  router.push({ name: CollectPaymentInfoRoute.name });

  loader.hide();
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row border-b pb-4">
      <span class="text-4xl">Buy Subscription Plan</span>
    </div>

    <div
      class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row lg:gap-12"
    >
      <div class="w-full basis-1/2">
        <div class="p-3 font-light sm:p-6">
          <div class="mb-6 border-b border-gray-300 pb-6">
            <p class="text-xl">
              Our subscription charges you a <i>base price</i> plus any
              <i>extra usage</i> over what is included.
            </p>
          </div>

          <div class="mb-6 border-b border-gray-300 pb-6">
            <p class="mb-2 text-xl font-normal">
              What is included every month?
            </p>
            <ul class="list-decimal px-5 text-lg">
              <li>
                <b>{{ numberFormatter(PlanDetails.included.responses) }}</b>
                Responses
              </li>
              <li>
                <b>{{ numberFormatter(PlanDetails.included.emails) }}</b>
                Emails
              </li>
            </ul>
          </div>

          <div class="mb-6 border-b border-gray-300 pb-6">
            <p class="mb-2 text-xl font-normal">
              How much does it cost if I use more than what is included?
            </p>
            <ul class="mb-4 list-decimal px-5 text-lg">
              <li>
                {{ moneyFormatter(PlanDetails.overagePrice.responses) }} /
                {{ numberFormatter(PlanDetails.overageUnit.responses) }}
                responses
              </li>
              <li>
                {{ moneyFormatter(PlanDetails.overagePrice.emails) }} /
                {{ numberFormatter(PlanDetails.overageUnit.emails) }} emails
              </li>
            </ul>
            <p class="text-sm font-extralight italic">
              Overage is billed monthly even if you pay for the base
              subscription yearly.
            </p>
          </div>

          <div>
            <p class="mb-2 text-xl font-normal">Need Help?</p>
            <p>
              Reach out to us at
              <a
                class="italic underline"
                target="_blank"
                href="mailto:sales@thepmftool.com"
              >
                sales@thepmftool.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <div class="w-full basis-1/2">
        <div class="flex flex-col gap-6 font-light">
          <div
            class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-green-600 p-6 hover:shadow-2xl"
            @click="buyPlan('yearly')"
          >
            <div>
              <p class="mb-1 text-3xl text-green-700">
                {{ moneyFormatter(PlanDetails.price.yearly / 12) }} /
                <b>Month</b>
              </p>
              <p class="mb-4 font-extralight">+ Overage</p>

              <p>
                Save
                <span class="text-green-700"> {{ moneyFormatter(200) }}</span>
                by paying {{ moneyFormatter(PlanDetails.price.yearly) }} once a
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
            class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-gray-300 p-6 hover:shadow-2xl"
            @click="buyPlan('monthly')"
          >
            <div>
              <p class="mb-1 text-2xl font-extralight">
                {{ moneyFormatter(PlanDetails.price.monthly) }} / Month
              </p>
              <p class="mb-4 font-extralight">+ Overage</p>

              <p>
                Save
                <span class="text-green-700">
                  {{ moneyFormatter(200) }}
                </span>
                <span class="text-sm"> (2 months free)</span> by paying once a
                year.
              </p>
            </div>

            <svg
              class="h-8 w-8 text-gray-700"
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
  </div>
</template>
