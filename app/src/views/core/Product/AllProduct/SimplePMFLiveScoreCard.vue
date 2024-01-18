<script setup lang="ts">
import { ref } from "vue";
import { useCacheableLiveScore } from "../../../../composable";
import type { ProductID } from "@domain-model";

const props = defineProps<{ productID: ProductID; cacheKey: string }>();

const liveScore = ref<Awaited<ReturnType<typeof useCacheableLiveScore>> | null>(
  null
);

// Call API and let it run in the background to complete page load faster.
useCacheableLiveScore(props.productID, props.cacheKey).then(
  (v) => (liveScore.value = v)
);
</script>

<template>
  <div
    class="w-full max-w-xs rounded-lg border border-zinc-200 bg-white p-4 font-light"
  >
    <div
      v-if="liveScore === null"
      class="flex h-full flex-col items-center justify-center text-xl font-thin"
    >
      <p>... loading ...</p>
    </div>

    <template v-else>
      <p
        v-if="liveScore.PMFScore.score === null"
        class="text-lg font-extralight"
      >
        No live score yet,
        <br />
        waiting for responses.
      </p>

      <template v-else>
        <p class="text-lg">
          Live Score,
          <span
            :class="{
              'text-lime-700': liveScore.PMFScore.score >= 40,
              'text-yellow-700':
                liveScore.PMFScore.score < 40 && liveScore.PMFScore.score >= 30,
              'text-red-700': liveScore.PMFScore.score < 30,
            }"
          >
            {{ liveScore.PMFScore.score }}
          </span>
        </p>

        <p>
          <span
            :class="{
              'text-lime-600':
                liveScore.reliability === 'Very reliable' ||
                liveScore.reliability === 'Reliable',
              'text-yellow-700': liveScore.reliability === 'Somewhat reliable',
              'text-red-700': liveScore.reliability === 'Less reliable',
            }"
          >
            {{ liveScore.reliability }}
          </span>
          with {{ liveScore.PMFScore.totalResponses }} responses.
        </p>
      </template>
    </template>
  </div>
</template>
