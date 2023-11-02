<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../../firebase";
import { useChart } from "../../../../store";
import type { ProductID, ReadManyPMFScoreDTO } from "@domain-model";

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

const props = defineProps<{ productID: ProductID }>();

const chartStore = useChart();

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

// For filling colours under the chart https://www.youtube.com/watch?v=w44bkUcew8U
const chartOptions = {
  responsive: true,

  // Smoothen out the curves just abit so they are not so jarring
  tension: 0.2,

  // Always show the full range for percentage values
  scales: { y: { min: 0, max: 100 } },
};

async function getChartData() {
  const { res, err } = await sf
    .useDefault()
    .GET(
      `/pmf/range/${props.productID}/?intervals=${chartStore.intervals}&intervalType=${chartStore.intervalType}`
    )
    .useHeader(getAuthHeader)
    .runJSON<ReadManyPMFScoreDTO>();

  if (err) throw err;
  if (!res.ok) throw new Error("Failed to load PMF Score for the Chart!");

  return {
    // This will be the time period number, and the start/end date of each period.
    labels: res.data.score
      .slice(0, -1)
      .map((a, index) => [
        `Period ${index + 1}`,
        `${new Date(a.timeWindow.start).toLocaleDateString()} to`,
        `${new Date(a.timeWindow.end).toLocaleDateString()}`,
      ])
      .concat([
        [
          `Current Period`,
          `${new Date(
            res.data.score[res.data.score.length - 1]?.timeWindow
              .start as string
          ).toLocaleDateString()} to`,
          `${new Date(
            res.data.score[res.data.score.length - 1]?.timeWindow.end as string
          ).toLocaleDateString()}`,
        ],
      ]),

    datasets: [
      {
        label: "PMF Percentage",

        // @todo
        // Highlight current time period's PMF score to say that it is not
        // confirmed until the time period ends!
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
        data: res.data.score.map(() => 40),

        pointRadius: 0,
        borderWidth: 2,
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",

        // Dont show the numerical label since it is always 40
        datalabels: { display: false },
      },
    ],
  };
}

const chartData = ref<Awaited<ReturnType<typeof getChartData>> | null>(null);

// Use watchEffect to update chartData on any reactive data change. This will
// also trigger the first initial run to get chart data.
watchEffect(async () => (chartData.value = await getChartData()));
</script>

<template>
  <!-- @todo Tmp any cast used to surpress the type error caused by the plugin options -->
  <Line
    v-if="chartData !== null"
    :options="chartOptions"
    :data="(chartData as any)"
  />
</template>
