<script setup lang="ts">
import { ref } from "vue";
import type { Product } from "@domain-model";
import Chart from "./Chart.vue";

defineProps<{ product: Product }>();

/**
 * Show this lastNIntervals
 * Default to 5 for weeks
 * Default to 3 for month and year
 *
 * @todo
 * This should be some user setting stored locally so that on refresh it is not
 * gone, and no need to store on the server.
 */
const intervals = ref<number>(5);

/**
 * This is the list of allowed values if the weekly interval type is choosen.
 * @todo Need to implement the check in the API too.
 */
const weeklyIntervalValues = [2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * This is the list of allowed values if the monthly interval type is choosen.
 * @todo Need to implement the check in the API too.
 */
// const monthlyIntervalValues = [2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * This is the list of allowed values if the yearly interval type is choosen.
 * @todo Need to implement the check in the API too.
 */
// const yearlyIntervalValues = [2, 3, 4, 5];
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col justify-between lg:flex-row lg:items-center">
      <p class="text-3xl font-extralight">PMF Performance</p>

      <div>
        Show past
        <select
          v-model="intervals"
          class="mx-2 rounded-lg bg-slate-100 px-3 py-1"
        >
          <option
            v-for="intervalsToShow in weeklyIntervalValues"
            :key="intervalsToShow"
            :value="intervalsToShow"
            :selected="intervalsToShow === intervals"
          >
            {{ intervalsToShow }}
          </option>
        </select>
        weeks
      </div>
    </div>

    <!-- @todo
      Tmp using intervals as the key also, so that on `intervals` value update,
      the entire Chart component will be reloaded/refreshed, without having to
      do any state watching within itself, and rely on vue to re-create the
      component and therefore re-running the setup function to get the data.
    -->
    <Chart :key="intervals" :product="product" :intervals="intervals" />
  </div>
</template>
