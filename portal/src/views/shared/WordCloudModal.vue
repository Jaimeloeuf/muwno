<script setup lang="ts">
import { ref, nextTick } from "vue";
import { createTypedChart } from "vue-chartjs";
import { Chart, LinearScale } from "chart.js";
import {
  WordCloudController,
  WordElement,
  type IWordElementOptions,
} from "chartjs-chart-wordcloud";
import { useNotif } from "../../store";

const props = defineProps<{
  termOccurrences: Array<{ word: string; count: number }>;
}>();

Chart.register(WordCloudController, WordElement, LinearScale);
const WordCloud = createTypedChart("wordCloud", WordCloudController);
const wordCloudOptions: Partial<IWordElementOptions> = {
  maxRotation: 0,
  minRotation: 0,
  padding: 8,
  rotate: 0,
  rotationSteps: 0,
  tooltips: { enabled: false },
  hover: { mode: null },

  // Disable all the plugins to make the word cloud look seamless.
  // The reason why these plugins are enabled is because in the PMF Score line
  // Chart, the plugins like Tooltip and Datalabels are enabled, which carries
  // over to all other use of Chart.js which is why it need to be manually
  // disabled over here for the word cloud.
  plugins: {
    tooltip: { enabled: false },
    legend: { display: false },
    datalabels: { display: false },
  },
};

/**
 * Determine size of largest term in pixesl based on the number of terms to show
 * in the word cloud and the width of the current viewport. The more terms to
 * show and the smaller the viewport, the smaller each term should be.
 */
function getSizeOfLargestTermInPixels(numOfTerms: number) {
  const sizeOfLargestTermInPixels = (function () {
    if (numOfTerms < 10) return 60;
    if (numOfTerms < 20) return 50;
    if (numOfTerms < 50) return 40;
    if (numOfTerms < 100) return 30;
    if (numOfTerms < 200) return 25;
    return 20;
  })();

  // Get `5vw` in pixels
  const fiveVW = window.innerWidth / 20;

  // Ensure largest term is limited to 5vw or 60 pixels, whichever is smaller
  return Math.min(sizeOfLargestTermInPixels, fiveVW, 60);
}

/**
 * Generate chart data based on the given props.
 */
function generateChartData() {
  // Split termOccurrences array into 2 arrays for terms and occurrence count
  const terms: Array<string> = [];
  const counts: Array<number> = [];
  for (const { word, count } of props.termOccurrences) {
    terms.push(word);
    counts.push(count);
  }

  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const difference = max - min;

  // Size in pixel for the largest term in word cloud
  const sizeOfLargestTermInPixels = getSizeOfLargestTermInPixels(counts.length);

  // Calculate multiplier needed to map the difference between
  const multiplier = sizeOfLargestTermInPixels / difference;

  // Transform term occurrence count inputs to pixel size.
  // If numbers are all the same, then all should be of the same size.
  const transformer =
    difference === 0
      ? () => sizeOfLargestTermInPixels
      : (count: number) => count * multiplier;

  // Map term occurrence count values to a list of Data points for the word
  // cloud after transforming them to fit in the 1 - sizeOfLargestTermInPixels
  // range. Data is a list of pixel sizes for each of the corresponding terms.
  const data = counts.map(transformer);

  // Approximate halfway point of 1 - sizeOfLargestTermInPixels range as int.
  const pixelRangeMidpoint = Math.ceil(sizeOfLargestTermInPixels / 2);

  // If all the term occurrence count is the same, do not use any colors.
  // Else, generate a bright/light color randomly for terms who have a count
  // more than the midpoint of the pixel size range.
  const color =
    difference === 0
      ? []
      : data.map((count) =>
          count > pixelRangeMidpoint
            ? `hsl(${Math.random() * 360},100%,75%)`
            : "#000"
        );

  return {
    labels: terms,
    datasets: [{ data, color }],
  };
}

const showModal = ref(false);
const chartData = ref<ReturnType<typeof generateChartData> | null>(null);

const notif = useNotif();
async function openModal() {
  if (props.termOccurrences.length === 0)
    return notif.setSnackbar("No data to generate Word Cloud!");

  showModal.value = true;

  // Show modal before running blocking function to compute chart data
  setTimeout(async () => {
    await nextTick();
    chartData.value = await generateChartData();
  });
}

/** Close modal and reset chart data so that it will be regenerated on next use */
function closeModal() {
  showModal.value = false;
  chartData.value = null;
}
</script>

<template>
  <div
    v-if="showModal"
    class="fixed left-0 top-0 z-30 h-screen w-screen bg-black bg-opacity-70 p-8"
    @click="closeModal"
  >
    <div class="absolute right-10 top-10">
      <button
        class="rounded-lg border border-zinc-700 bg-zinc-300 px-8 py-1 shadow-lg"
        @click="closeModal"
      >
        close
      </button>
    </div>

    <div
      v-if="chartData !== null"
      class="h-full w-full rounded-lg bg-white p-3 lg:p-6"
      @click.stop
    >
      <WordCloud class="w-full" :data="chartData" :options="wordCloudOptions" />
    </div>

    <p v-else class="rounded-lg bg-white p-6 text-xl font-medium">
      ... Generating Word Cloud ...
    </p>
  </div>

  <!--
    Pass reference to `openModal` function to slot component so parent component
    can implement its own button while still having reference to the function
    needed to generate the wordcloud image and open the modal.
  -->
  <slot :open="openModal"></slot>
</template>
