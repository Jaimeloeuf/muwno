<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import type { ProductID, ReadOnePMFLiveScoreDTO } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const { res, err } = await sf
  .useDefault()
  .GET(`/product/PMF/live/${props.productID}`)
  .useHeader(getAuthHeader)
  .runJSON<ReadOnePMFLiveScoreDTO>();

if (err) throw err;
if (!res.ok) throw new Error("Failed to load PMF live score!");

const score = res.data.score;
</script>

<template>
  <div class="inline-block min-w-[8rem] rounded-lg bg-slate-50 p-4 shadow">
    <!-- @todo Add an icon for user to click and understand what is a live score -->
    <div class="mb-0.5">
      <p class="text-sm font-medium">Live Score</p>
      <p v-if="score !== null" class="text-xs font-extralight">
        Your live score across the last 7 days
      </p>
    </div>

    <template v-if="score === null">
      <p class="font-light">Waiting for Responses</p>
    </template>

    <div v-else class="">
      <p class="text-right text-4xl">
        <span
          :class="{
            'text-lime-700': score.currentPMFScore >= 40,
            'text-red-700': score.currentPMFScore < 40,
          }"
        >
          {{ score.currentPMFScore }}
        </span>
        <span class="font-extralight">/40</span>
      </p>

      <!-- @todo Add Up / Down arrows to show trend if you improved this week or got worse -->
    </div>
  </div>
</template>
