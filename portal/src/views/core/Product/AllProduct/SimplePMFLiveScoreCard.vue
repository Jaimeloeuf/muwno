<script setup lang="ts">
import { useLiveScore } from "../shared/useLiveScore";
import type { ProductID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const { PMFScore, reliability } = await useLiveScore(props.productID);
</script>

<template>
  <div class="w-max rounded-lg border border-slate-200 bg-white p-4 font-light">
    <p v-if="PMFScore.score === null" class="text-lg font-extralight">
      No live score yet,
      <br />
      waiting for responses.
    </p>

    <div v-else>
      <p class="text-lg">
        Live Score,
        <span
          :class="{
            'text-lime-700': PMFScore.score >= 40,
            'text-yellow-700': PMFScore.score < 40 && PMFScore.score >= 30,
            'text-red-700': PMFScore.score < 30,
          }"
        >
          {{ PMFScore.score }}
        </span>
      </p>

      <p>
        <span
          :class="{
            'text-lime-600':
              reliability === 'Very reliable' || reliability === 'Reliable',
            'text-yellow-700': reliability === 'Somewhat reliable',
            'text-red-700': reliability === 'Less reliable',
          }"
        >
          {{ reliability }}
        </span>
        with {{ PMFScore.totalResponses }} responses.
      </p>
    </div>
  </div>
</template>
