<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { sf } from "simpler-fetch";
import { useLoader } from "../../../store";
import { getAuthHeader } from "../../../firebase";
import { useSearch } from "../../../composable";
import TopNavbar from "../../shared/TopNavbar.vue";
import type { ProductID, ReadWordOccurrenceDTO } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const loader = useLoader();

/**
 * value is in seconds
 */
const timeRanges = [
  { name: "Last 24 hours", value: 86400 },
  { name: "Last week", value: 604800 },
  { name: "Last 2 weeks", value: 1.21e6 },
  { name: "Last month", value: 2.592e6 },
  { name: "All time up to 1000 responses", value: 0 },
] as const;
const selectedTimeRange = ref<(typeof timeRanges)[number]["value"]>(1.21e6);

async function getWordOccurrence() {
  loader.show();

  const { res, err } = await sf
    .useDefault()
    .GET(`/feedback/response/word-occurrence/a2/${props.productID}`)
    .useQuery<{ timeRange: string }>({
      timeRange: selectedTimeRange.value.toString(),
    })
    .useHeader(getAuthHeader)
    .runJSON<ReadWordOccurrenceDTO>();

  loader.hide();

  if (err) throw err;
  if (!res.ok)
    throw new Error(
      `Fail to generate word occurrence data: ${JSON.stringify(res)}`
    );

  // Sort the word occurrence by most common first
  const sortedWordOccurrence = Object.entries(res.data.wordOccurences)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);

  return sortedWordOccurrence;
}

const wordOccurrences = ref<Awaited<ReturnType<typeof getWordOccurrence>>>([]);

// Use watchEffect to update wordOccurrences on any reactive data change. This
// will also trigger the first initial run to get the data.
watchEffect(async () => (wordOccurrences.value = await getWordOccurrence()));

/** Ref to the DOM element so that it can be cleared by `clearSearchInputHandler` */
const searchField = ref<HTMLInputElement | null>(null);

const { searchInput, results, clearSearchInput } = useSearch(
  wordOccurrences,
  { keys: ["word"], threshold: 0.5, resultLimit: 10 },
  () => searchField.value?.focus()
);
</script>

<template>
  <TopNavbar back>User Personas</TopNavbar>

  <div class="mx-auto xl:max-w-screen-xl">
    <div
      class="flex flex-col items-center justify-between gap-3 pb-4 sm:flex-row"
    >
      <label class="w-full max-w-xl">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              class="h-5 w-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>

          <input
            ref="searchField"
            v-model.trim="searchInput"
            type="text"
            class="w-full rounded-lg border border-zinc-200 p-2 pl-10 focus:outline-none"
            placeholder="Search"
          />

          <button
            class="absolute inset-y-0 right-0 rounded-r-lg border border-zinc-200 border-l-zinc-100 bg-zinc-50 px-4 font-extralight text-zinc-900"
            @click="clearSearchInput"
          >
            clear
          </button>
        </div>
      </label>

      <select
        v-model="selectedTimeRange"
        class="w-full rounded-lg border border-zinc-200 p-2.5 focus:outline-none sm:w-max"
      >
        <option
          v-for="timeRange in timeRanges"
          :key="timeRange.value"
          :value="timeRange.value"
          :selected="timeRange.value === selectedTimeRange"
        >
          {{ timeRange.name }}
        </option>
      </select>
    </div>

    <div v-if="wordOccurrences.length === 0" class="mx-auto xl:max-w-screen-xl">
      <p class="text-2xl font-light">No data in selected time period.</p>
    </div>

    <table
      v-else
      class="w-full table-fixed border-spacing-x-4 border border-zinc-200 text-left"
    >
      <thead class="bg-zinc-200 text-zinc-800">
        <tr>
          <th class="border border-zinc-300 p-2">Keyword</th>
          <th class="border border-zinc-300 p-2">Count</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="{ count, word } in results"
          :key="word"
          class="even:bg-zinc-100 hover:bg-purple-300 hover:text-zinc-900"
        >
          <td class="border border-zinc-200 p-2">{{ word }}</td>
          <td class="border border-zinc-200 p-2">{{ count }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
