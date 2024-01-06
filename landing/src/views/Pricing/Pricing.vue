<script setup lang="ts">
import { ref } from "vue";
import PricingCalculator from "./PricingCalculator.vue";
import Navbar from "../shared/Navbar.vue";
import muwno from "../shared/muwno.vue";
import CtaButton from "../shared/CtaButton.vue";
import Footer from "../shared/Footer.vue";
import { numberFormatter, smallMoneyFormatter } from "./utils";
import { flags } from "../../utils/flags";
import { PlanDetails } from "@domain-model";

const pricingCalculatorKey = ref(Math.random());

function useSelfChangingAlternatives() {
  const alternatives = [
    "unhappy customers churning",
    "building the wrong features",
    "manually analysing feedback",
    "wasting time",
  ];

  const alternative = ref(alternatives[0]);

  const loop = async () => {
    let index = 0;
    while (true) {
      await new Promise((res) => setTimeout(res, 3000));
      index = (index + 1) % alternatives.length;
      alternative.value = alternatives[index];
    }
  };
  loop();

  return alternative;
}

const alternative = useSelfChangingAlternatives();
</script>

<template>
  <Navbar />

  <div
    class="mx-auto max-w-2xl p-6 pb-20 pt-8 md:px-12 lg:max-w-max lg:px-16 lg:pt-10 xl:px-20"
  >
    <p
      class="max-w-screen-xl pb-8 text-3xl font-bold text-zinc-800 md:text-4xl lg:pb-12"
    >
      <muwno /> costs less than
      <span
        class="underline decoration-primary decoration-2 underline-offset-4"
        >{{ alternative }}</span
      >.
    </p>

    <div class="flex flex-col justify-between gap-10 pb-8 lg:flex-row lg:pb-12">
      <div class="w-full font-light">
        <p class="text-xl font-bold text-zinc-700 md:text-2xl">
          Start for
          <span class="rounded-lg bg-yellow-300 px-2">FREE</span>
        </p>

        <p class="pb-8 md:text-lg">
          Simple, Honest pricing with no hidden fees.
          <br />
          You only pay for what you use over the free tier.
        </p>

        <div class="pb-8">
          <p class="text-xl font-normal">Monthly free tier includes</p>

          <div class="pb-4">
            <p class="font-normal">Usage</p>
            <ul class="list-decimal px-5">
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
            <ul class="list-decimal px-5">
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

        <div class="pb-8">
          <p class="text-xl font-normal">After the free tier</p>

          <div class="pb-4">
            <p class="font-normal">Usage</p>
            <ul class="list-decimal px-5">
              <li>
                {{
                  smallMoneyFormatter(PlanDetails.overage.response.price.USD)
                }}
                / Survey response
              </li>
              <li>
                {{ smallMoneyFormatter(PlanDetails.overage.email.price.USD) }}
                / Survey email
              </li>
            </ul>
          </div>

          <div>
            <p class="font-normal">Storage</p>
            <ul class="list-decimal px-5">
              <li>
                {{
                  smallMoneyFormatter(
                    PlanDetails.overage.responseStored.price.USD,
                  )
                }}
                / Survey response stored
              </li>
              <li v-if="flags.devMode">
                {{
                  smallMoneyFormatter(
                    PlanDetails.overage.customerStored.price.USD,
                  )
                }}
                / Customer stored
              </li>
            </ul>
          </div>
        </div>

        <p class="pb-12 font-extralight italic">*Prices are in USD</p>

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
          <p>Volume, startup and special discounts available.</p>
        </div>
      </div>

      <div class="flex w-full flex-col gap-6 font-light">
        <PricingCalculator
          :key="pricingCalculatorKey"
          @reset="pricingCalculatorKey = Math.random()"
        />
      </div>
    </div>

    <CtaButton />
  </div>

  <Footer></Footer>
</template>
