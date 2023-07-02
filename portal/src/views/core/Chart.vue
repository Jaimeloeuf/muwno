<script setup lang="ts">
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

/**
 * Utility for generating ISODateTime strings
 */
const generateLocaleDateString = (differenceInMs = 0) =>
  new Date(new Date().getTime() + differenceInMs).toLocaleDateString();

const labels = [];
for (let i = 12; i > 0; i--) {
  labels.push([
    `Sprint ${i}`,
    `${generateLocaleDateString(-1.21e9 * (12 - (i - 1)))} to`,
    `${generateLocaleDateString(-1.21e9 * (12 - i))}`,
  ]);
}
labels.reverse();

const chartData = {
  // This will be the sprint number + starting or end date
  labels,

  datasets: [
    {
      label: "PMF Percentage",

      data: [20, 23, 20, 30, 31, 32, 38, 41, 47, 35, 42],

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

const chartOptions = {
  responsive: true,

  // Smoothen out the curves just abit so they are not so jarring
  tension: 0.2,

  // Always show the full range for percentage values
  scales: { y: { min: 0, max: 100 } },
};
</script>

<template>
  <!-- Tmp hack used to surpress the type error caused by the plugin options -->
  <Line class="m-12" :options="chartOptions" :data="(chartData as any)" />
</template>
