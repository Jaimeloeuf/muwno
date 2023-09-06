<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import type { ProductID, ReadOnePMFScoreDTO } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const { res, err } = await sf
  .useDefault()
  .GET(`/product/PMF/live/${props.productID}`)
  .useHeader(getAuthHeader)
  .runJSON<ReadOnePMFScoreDTO>();

if (err) throw err;
if (!res.ok) throw new Error("Failed to load PMF live score!");

const PMFScore = res.data.score;
</script>

<template>
  <div class="inline-block min-w-[8rem] rounded-lg bg-slate-50 p-4 shadow">
    <!-- @todo Add an icon for user to click and understand what is a live score -->
    <!-- @todo Allow users to edit the time period in which to calculate for live score -->
    <div class="mb-0.5">
      <p class="text-sm font-medium">Live Score</p>
      <p class="text-xs font-extralight">
        Your live score across the last 7 days
      </p>

      <!-- @todo
        live responses is only for past X days which means if u dont have new
        survey responses, it cant calculate the score, which is why there might
        be a need for an 'All time score' card.
      -->
    </div>

    <template v-if="PMFScore.score === null">
      <p class="text-xl font-extralight">No Responses in current window...</p>
    </template>

    <div v-else class="">
      <p class="text-right text-4xl">
        <span
          :class="{
            'text-lime-700': PMFScore.score >= 40,
            'text-red-700': PMFScore.score < 40,
          }"
        >
          {{ PMFScore.score }}
        </span>
        <span class="font-extralight">/40</span>
      </p>

      <!-- @todo Add Up / Down arrows to show trend if you improved this week or got worse -->
    </div>
  </div>
</template>
