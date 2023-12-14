<script setup lang="ts">
import { ref } from "vue";
import { normalMoneyFormatter } from "./utils";

const payYearly = ref(true);

/**
 * Example base subscription price object
 */
const price = {
  monthly: {
    SGD: 100,
  },
  yearly: {
    SGD: 1000,
  },
};
</script>

<template>
  <div class="rounded-lg border border-zinc-200 p-6">
    <div
      class="flex flex-col justify-between gap-4 pb-2 sm:flex-row sm:items-center"
    >
      <p class="text-2xl">Base Subscription</p>

      <div>
        <label class="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" v-model="payYearly" class="peer sr-only" />
          <div
            class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] focus:outline-none peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full"
          ></div>
          <span class="pl-3 text-sm font-medium text-zinc-700">
            Pay {{ payYearly ? "Yearly" : "Monthly" }}
          </span>
        </label>
      </div>
    </div>

    <div v-if="payYearly" class="w-full">
      <p class="pb-1 text-xl font-light text-green-700">
        {{ normalMoneyFormatter(price.yearly.SGD / 12) }} / Month
      </p>
      <p>
        {{ normalMoneyFormatter(price.yearly.SGD) }} Paid once a year + Monthly
        Overages
      </p>
    </div>

    <div v-else class="w-full">
      <p class="pb-1 text-xl font-extralight">
        {{ normalMoneyFormatter(price.monthly.SGD) }} / Month + Overages
      </p>
    </div>

    <p class="pt-4">
      Save
      <span class="text-green-700">
        {{ normalMoneyFormatter(price.monthly.SGD * 12 - price.yearly.SGD) }}
      </span>
      <span class="text-sm"> (2 months free)</span> by paying
      {{ normalMoneyFormatter(price.yearly.SGD) }} once a year.
    </p>
  </div>
</template>
