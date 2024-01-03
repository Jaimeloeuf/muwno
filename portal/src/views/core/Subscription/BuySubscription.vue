<script setup lang="ts">
import { OnboardingRoute } from "../../../router";
import Accordion from "../../shared/Accordion.vue";
import TopNavbar from "../../shared/TopNavbar.vue";
import RouteEnterButton from "../../shared/RouteEnterButton.vue";
import SetupPaymentMethod from "./Stripe/SetupPaymentMethod.vue";
import {
  numberFormatter,
  smallMoneyFormatter,
  flags,
  landingLink,
} from "../../../utils";
import { PlanDetails } from "@domain-model";
</script>

<template>
  <div>
    <TopNavbar back :backRoute="{ name: OnboardingRoute.name }">
      Buy Subscription Plan
    </TopNavbar>

    <div
      class="mx-auto flex max-w-screen-xl flex-col justify-between gap-12 lg:flex-row lg:pt-6"
    >
      <div class="mx-auto w-full max-w-xl basis-1/2 font-light">
        <p class="pb-4 text-5xl font-bold text-zinc-700">
          Start for
          <span class="rounded-lg bg-yellow-300 px-2">FREE</span>
        </p>

        <p class="pb-4 text-xl">
          Simple, Honest pricing with no hidden fees. Only pay what you use over
          the free tier.
        </p>

        <p class="pb-8 text-lg">
          Payment details are required for verification and future payments
          only. You will not be charged today.
        </p>

        <Accordion defaultState="show">
          <template #summary>
            <p class="text-xl font-normal">
              Monthly
              <span class="underline decoration-zinc-300 underline-offset-2">
                free tier</span
              >
              includes
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

        <Accordion class="pb-8" defaultState="hide">
          <template #summary>
            <p class="text-xl font-normal">After the free tier</p>
          </template>

          <template #content>
            <div class="pb-4">
              <p class="pb-1 font-normal">Usage</p>
              <ul class="list-decimal px-5 text-lg">
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

            <div class="pb-4">
              <p class="pb-1 font-normal">Storage</p>
              <ul class="list-decimal px-5 text-lg">
                <li>
                  {{
                    smallMoneyFormatter(
                      PlanDetails.overage.responseStored.price.USD
                    )
                  }}
                  / Survey response stored
                </li>
                <li v-if="flags.devMode">
                  {{
                    smallMoneyFormatter(
                      PlanDetails.overage.customerStored.price.USD
                    )
                  }}
                  / Customer stored
                </li>
              </ul>
            </div>

            <p class="pb-4 font-extralight italic">*Prices are in USD</p>

            <RouteEnterButton
              :to="{}"
              :href="`${landingLink}/#/pricing`"
              target="_blank"
            >
              Estimate Cost
            </RouteEnterButton>
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

      <SetupPaymentMethod />
    </div>

    <div class="pb-12"></div>
  </div>
</template>
