<script setup lang="ts">
import { ref } from "vue";
import { useProduct } from "../../../../../store";
import { useLiveScore } from "../../shared/useLiveScore";
import type { ProductID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const productStore = useProduct();
const product = await productStore.getProduct(props.productID);

const showHelp = ref(false);

const { PMFScore, reliability } = await useLiveScore(props.productID);
</script>

<template>
  <!-- @todo Allow users to edit live score time period setting -->
  <div class="w-full rounded-lg border border-zinc-200 p-4">
    <template v-if="PMFScore.score === null">
      <div class="mb-1 flex flex-row items-center justify-between">
        <p class="text-sm font-medium">
          Live PMF Score<span class="pl-1.5 font-light">(Aim for 40)</span>
        </p>

        <button
          class="flex cursor-pointer rounded-lg bg-zinc-100 px-3 font-light text-zinc-900"
          @click="showHelp = !showHelp"
        >
          Help
        </button>
      </div>

      <p class="flex-shrink text-xl font-extralight">
        Waiting for Responses in current window.
      </p>
    </template>

    <div v-else class="flex flex-col items-center justify-between sm:flex-row">
      <p>
        <span
          class="text-5xl"
          :class="{
            'text-lime-700': PMFScore.score >= 40,
            'text-yellow-700': PMFScore.score < 40 && PMFScore.score >= 30,
            'text-red-700': PMFScore.score < 30,
          }"
        >
          {{ PMFScore.score }} </span
        ><span class="text-sm font-extralight">/100</span>
      </p>

      <div>
        <div class="mb-1 flex flex-row items-center justify-between">
          <p class="pr-3 text-sm font-medium">
            Live PMF Score<span class="pl-1.5 font-light">(Aim for 40)</span>
          </p>

          <button
            class="flex cursor-pointer rounded-lg bg-zinc-100 px-3 font-light text-zinc-900"
            @click="showHelp = !showHelp"
          >
            Help
          </button>
        </div>

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
          <span class="font-light">
            with
            <span class="font-normal">{{ PMFScore.totalResponses }}</span>
            responses.</span
          >
        </p>
      </div>
    </div>

    <div
      v-if="showHelp"
      class="mt-2 border-t border-zinc-200 pt-2 text-sm font-light"
    >
      <ul class="list-decimal space-y-2 px-4">
        <li>
          This is the product's live PMF (Product Market Fit) score across the
          last 7 days.
        </li>
        <li>
          This score is the percentage of survey responders that selected
          <i>'Very disappointed'</i> for the question "How would you feel if
          {{ product.name }} no longer exists?"
        </li>
        <li>
          You should improve your product to score at least 40 to reach Product
          Market Fit.
        </li>
        <li>
          <p class="pb-1">
            The score's reliablity ranges from less reliable to very reliable
            based on the number of responses.
          </p>
          It may not be representative of your entire customer base if you only
          survey a small percentage of your entire customer base.
        </li>
        <!-- @todo -->
        <!-- <li>Link to youtube tutorial</li> -->
      </ul>
    </div>
  </div>
</template>
