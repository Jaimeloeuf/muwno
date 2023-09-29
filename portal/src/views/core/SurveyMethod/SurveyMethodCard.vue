<script setup lang="ts">
import Accordion from "../../components/Accordion.vue";
import type { ProductID, SurveyMethod } from "@domain-model";

defineProps<{
  index: number;
  productID: ProductID;
  surveyMethod: SurveyMethod;
}>();
</script>

<template>
  <div class="w-full max-w-lg rounded-lg border border-zinc-200 p-6 font-light">
    <div
      class="mb-6 flex flex-row items-center justify-between border-b border-zinc-200 pb-3"
    >
      <p class="mr-2 text-2xl text-zinc-900">
        {{ index }}. {{ surveyMethod.name }}
      </p>

      <p v-if="surveyMethod.unimplemented" class="text-xl text-yellow-500">
        Coming Soon
      </p>
      <button
        v-else
        class="rounded-lg border border-green-600 px-8 py-0.5 text-xl text-green-600"
      >
        Use
      </button>
    </div>

    <div class="pb-2">
      <p class="pb-1 text-lg">Use this if</p>
      <ul class="list-decimal px-5">
        <li v-for="usecase in surveyMethod.usecase" :key="usecase">
          {{ usecase }}
        </li>
      </ul>
    </div>

    <Accordion>
      <template #summary>
        <p class="text-left text-xl">Useful for these Product Types</p>
      </template>

      <template #content>
        <ul class="list-decimal px-5 pb-2 text-lg">
          <li
            v-for="productType in surveyMethod.productTypes"
            :key="productType"
          >
            {{ productType }}
          </li>
        </ul>

        <p>
          For example, <i>{{ surveyMethod.productExamples.join(", ") }}</i>
        </p>
      </template>
    </Accordion>

    <Accordion>
      <template #summary>
        <p class="text-left text-xl">How does this method work?</p>
      </template>

      <template #content>
        <ul class="list-decimal px-5">
          <li
            v-for="modeDescriptionPoint in surveyMethod.descriptions"
            :key="modeDescriptionPoint"
          >
            {{ modeDescriptionPoint }}
          </li>
        </ul>
      </template>
    </Accordion>
  </div>
</template>
