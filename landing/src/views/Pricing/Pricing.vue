<script setup lang="ts">
import { ref } from "vue";
import PricingCalculator from "./PricingCalculator.vue";
import Navbar from "../shared/Navbar.vue";
import { numberFormatter, smallMoneyFormatter } from "./utils";
import { flags } from "../../utils/flags";
import { PlanDetails } from "@domain-model";

const pricingCalculatorKey = ref(Math.random());
const payYearly = ref(true);
</script>

<template>
  <Navbar />

  <div
    class="mx-auto flex max-w-screen-sm flex-col justify-between gap-10 p-6 md:px-12 lg:max-w-max lg:flex-row lg:px-16 lg:pt-10 xl:px-20"
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

      <div class="pb-8">
        <p class="text-left text-xl font-normal">Monthly free tier includes</p>

        <div class="pb-4">
          <p class="font-normal">Usage</p>
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
          <p class="font-normal">Storage</p>
          <ul class="list-decimal px-5 text-lg">
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
      </div>

      <div class="pb-12">
        <p class="text-left text-xl font-normal">After the free tier</p>

        <div class="pb-4">
          <p class="font-normal">Usage</p>
          <ul class="list-decimal px-5 text-lg">
            <li>
              {{ smallMoneyFormatter(PlanDetails.overage.response.price.SGD) }}
              / Survey response
            </li>
            <li>
              {{ smallMoneyFormatter(PlanDetails.overage.email.price.SGD) }}
              / Survey email
            </li>
          </ul>
        </div>

        <div>
          <p class="font-normal">Storage</p>
          <ul class="list-decimal px-5 text-lg">
            <li>
              {{
                smallMoneyFormatter(
                  PlanDetails.overage.responseStored.price.SGD,
                )
              }}
              / Survey response stored
            </li>
            <li v-if="flags.devMode">
              {{
                smallMoneyFormatter(
                  PlanDetails.overage.customerStored.price.SGD,
                )
              }}
              / Customer stored
            </li>
          </ul>
        </div>
      </div>

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

    <div class="flex w-full flex-col gap-6 font-light">
      <PricingCalculator
        :key="pricingCalculatorKey"
        :payYearly="payYearly"
        @reset="pricingCalculatorKey = Math.random()"
      />
    </div>
  </div>
</template>
