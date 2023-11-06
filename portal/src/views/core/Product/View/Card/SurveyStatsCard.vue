<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../../../firebase";
import { flags } from "../../../../../utils/flags";
import type { ProductID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

// @todo
// tldr; stats on survey method distribution results + response performance
//
// This should be basic stats like how many survey opens and how many responses
// it should not be of individual ones?
// and this should be across a time period like 7 days or something

async function getStats() {
  const { res, err } = await sf
    .useDefault()
    .GET(`/feedback/response/stats/${props.productID}`)
    .useHeader(getAuthHeader)
    .runJSON<{ stats: number }>();

  if (err) throw err;
  if (!res.ok) throw new Error(`Failed to get Stats: ${JSON.stringify(res)}`);

  return res.data.stats;
}

const responses = ref<number | string>("...loading...");

getStats().then((stats) => (responses.value = stats));
</script>

<template>
  <div class="w-full rounded-lg border border-zinc-200 p-4">
    <div
      class="mb-2 flex flex-row items-center justify-between border-b border-zinc-200 pb-2"
    >
      <p>Survey Stats</p>

      <!-- @todo Page with more in depth analytics -->
      <router-link
        v-if="flags.devMode"
        :to="{}"
        class="rounded-lg bg-zinc-100 px-3 font-light"
      >
        Details
      </router-link>
    </div>

    <div class="font-light">
      <p>Responses: {{ responses }}</p>
    </div>

    <!-- @todo Above 15% show green -->
    <!-- <div class="mb-2 pb-2">
      <p class="text-xl text-lime-600">21% response rate</p>
      <p class="text-lg">{{ 100 }} surveys sent, {{ 21 }} responded.</p>
    </div> -->
  </div>
</template>
