<script setup lang="ts">
import { sf } from "simpler-fetch";
import type { Product, ReadManyPMFScoreDTO } from "domain-model";

import { Line } from "vue-chartjs";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const props = defineProps<{ product: Product }>();

// Make sure no negative starting sprint numbers
const startSprint =
  props.product.currentSprint - 5 > 0 ? props.product.currentSprint - 5 : 0;

const { res, err } = await sf
  .useDefault()
  .GET(
    `/product/PMF/historical/${props.product.id}/?startSprint=${startSprint}&endSprint=${props.product.currentSprint}`
  )
  .runJSON<ReadManyPMFScoreDTO>();

if (err) throw err;
if (!res.ok) throw new Error("Failed to load PMF Score for the Chart!");

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

const chartData = {
  // This will be the sprint number, start date of sprint and end date of sprint
  labels: res.data.score.map((a) => [
    `Sprint ${a.sprintNumber}`,
    `${new Date(a.sprintWindow.start).toLocaleDateString()} to`,
    `${new Date(a.sprintWindow.end).toLocaleDateString()}`,
  ]),

  datasets: [
    {
      label: "PMF Percentage",

      data: res.data.score.map((a) => a.score),

      pointRadius: 4,
      pointBackgroundColor: "#737373",
      borderWidth: 2,
      borderColor: "#737373",
      fill: {
        target: { value: 40 },
        above: "#84cc16",
        below: "transparent",
      },
      datalabels: {
        align: "top",
        anchor: "end",
        formatter: Math.round,
        font: { size: 16 },
      },
    },
    {
      label: "PMF Goal!",

      // Dynamically generate this fixed line
      data: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40],

      pointRadius: 0,
      borderWidth: 2,
      borderColor: "#22c55e",
      backgroundColor: "#22c55e",

      // Dont show the numerical label since it is always 40
      datalabels: { display: false },
    },
  ],
};

// For filling colours under the chart https://www.youtube.com/watch?v=w44bkUcew8U
const chartOptions = {
  responsive: true,

  // Smoothen out the curves just abit so they are not so jarring
  tension: 0.2,

  // Always show the full range for percentage values
  scales: { y: { min: 0, max: 100 } },
};
</script>

<template>
  <div>
    <div class="flex flex-row items-center justify-between">
      <p class="text-3xl font-extralight">PMF Performance</p>
    </div>

    <!-- @todo Tmp any cast used to surpress the type error caused by the plugin options -->
    <Line :options="chartOptions" :data="(chartData as any)" />
  </div>
</template>
