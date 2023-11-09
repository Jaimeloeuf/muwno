<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import PricingCalculator from "./PricingCalculator.vue";
import Footer from "../components/Footer.vue";
import {
  numberFormatter,
  normalMoneyFormatter,
  smallMoneyFormatter,
} from "./utils";
import { flags } from "../../utils/flags";
import { PlanDetails } from "@domain-model";
</script>

<template>
  <Navbar />

  <div
    class="flex flex-col justify-between gap-6 px-4 pb-6 md:px-12 lg:flex-row lg:gap-12 lg:px-16 xl:px-24"
  >
    <div class="w-full font-light">
      <div class="pb-6">
        <p class="pb-6 text-5xl font-bold text-zinc-700">
          Simple, Transparent Pricing
        </p>
        <p class="text-xl">
          Choose a payment schedule for your needs. No hidden fees.
        </p>
      </div>

      <p class="pb-6 text-xl">
        Our subscription charges you a <i>base price</i> plus any
        <i>extra usage</i> over what is included. Just like a telco
        subscription!
      </p>

      <div class="pb-2">
        <p class="text-left text-xl font-normal">
          What is included every month?
        </p>

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
            <li v-if="flags.devMode">
              {{ numberFormatter(PlanDetails.included.customerStored) }}
              Customers stored
            </li>
          </ul>
        </div>
      </div>

      <div class="pb-8">
        <p class="text-left text-xl font-normal">
          How much does it cost if I use more than what is included?
        </p>

        <div class="pb-4">
          <p class="pb-1 font-normal">Usage</p>
          <ul class="list-decimal px-5 text-lg">
            <li>
              {{ smallMoneyFormatter(PlanDetails.overage.response.price.SGD) }}
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

        <p class="font-thin italic">
          Overage is billed monthly even if you pay for the base subscription
          yearly.
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
      </div>

      <div>
        <p class="mb-2 text-xl font-normal">Need Help?</p>
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
        class="flex w-full flex-row items-center justify-between rounded-lg border border-green-600 p-6 hover:shadow-2xl"
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
                    PlanDetails.price.SGD.yearly,
                )
              }}
            </span>
            by paying
            {{ normalMoneyFormatter(PlanDetails.price.SGD.yearly) }} once a
            year.
          </p>
        </div>
      </div>

      <div
        class="flex w-full flex-row items-center justify-between rounded-lg border border-zinc-200 p-6 hover:shadow-2xl"
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
                    PlanDetails.price.SGD.yearly,
                )
              }}
            </span>
            <span class="text-sm"> (2 months free)</span> by paying once a year
            instead.
          </p>
        </div>
      </div>

      <PricingCalculator />
    </div>
  </div>

  <Footer></Footer>
</template>
