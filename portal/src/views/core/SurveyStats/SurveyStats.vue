<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import TopNavbar from "../../shared/TopNavbar.vue";
import { numberFormatter } from "../../../utils/numericalFormatter";
import type { ProductID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

// @todo
// tldr; stats on survey method distribution results + response performance
//
// This should be basic stats like how many survey opens and how many responses
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

const responses = ref<number>(await getStats());
</script>

<template>
  <TopNavbar back>Survey Stats</TopNavbar>

  <div class="mx-auto max-w-screen-xl">
    <div class="rounded-lg border border-zinc-200 p-3">
      <p>Number of Survey Responses currently stored</p>
      <p class="text-lg font-medium">{{ numberFormatter(responses) }}</p>
    </div>

    <!-- @todo Above 15% show green -->
    <!-- <div class="mb-2 pb-2">
      <p class="text-xl text-lime-600">21% response rate</p>
      <p class="text-lg">{{ 100 }} surveys sent, {{ 21 }} responded.</p>
    </div> -->
  </div>
</template>
