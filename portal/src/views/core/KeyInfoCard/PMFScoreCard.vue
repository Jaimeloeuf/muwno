<script setup lang="ts">
import { sf } from "simpler-fetch";
import type { Product, ReadOnePMFLiveScoreDTO } from "domain-model";

const props = defineProps<{ productID: Product["id"] }>();

const { res, err } = await sf
  .useDefault()
  .GET(`/product/PMF/live/${props.productID}`)
  .runJSON<ReadOnePMFLiveScoreDTO>();

if (err) throw err;
if (!res.ok) throw new Error("Failed to load PMF live score!");

const score = res.data.score;
</script>

<template>
  <div
    class="inline-block w-full min-w-[8rem] rounded-lg bg-slate-50 p-4 shadow"
  >
    <!-- @todo Add an icon for user to click and understand what is a live score -->
    <p class="text-sm font-medium">Live Score</p>

    <div v-if="score === null">
      <p class="text-center font-extralight">Waiting for Responses</p>
    </div>

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
