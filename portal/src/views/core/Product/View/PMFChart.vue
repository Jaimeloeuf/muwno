<script setup lang="ts">
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useChart } from "../../../../store";
import Chart from "./Chart.vue";
import { type ProductID, IntervalType } from "@domain-model";

defineProps<{ productID: ProductID }>();

const chartStore = useChart();

const { intervalType: storeIntervalType } = storeToRefs(chartStore);
watch(storeIntervalType, chartStore.onIntervalTypeChange);
</script>

<template>
  <div>
    <div
      class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center lg:pr-4"
    >
      <div class="flex flex-col md:flex-row md:items-end md:gap-4">
        <p class="text-3xl font-thin">Performance over time</p>
        <a
          href="#"
          target="_blank"
          class="font-thin underline decoration-zinc-300"
        >
          What is this?
        </a>
      </div>

      <div>
        Past
        <select
          v-model="chartStore.intervals"
          class="mx-1 rounded-lg bg-zinc-100 px-3 py-1 focus:outline-none"
        >
          <option
            v-for="interval in chartStore.intervalValues"
            :key="interval"
            :value="interval"
            :selected="interval === chartStore.intervals"
          >
            {{ interval }}
          </option>
        </select>

        <select
          v-model="chartStore.intervalType"
          class="rounded-lg bg-zinc-100 py-1 pl-3 focus:outline-none"
        >
          <option
            v-for="intervalType in IntervalType"
            :key="intervalType"
            :value="intervalType"
            :selected="intervalType === chartStore.intervalType"
          >
            {{ intervalType }}
          </option>
        </select>
      </div>
    </div>

    <Chart :productID="productID" />
  </div>
</template>
