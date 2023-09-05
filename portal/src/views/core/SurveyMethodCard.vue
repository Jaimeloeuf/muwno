<script setup lang="ts">
import Accordion from "../components/Accordion.vue";
import type { ProductID, SurveyMethod } from "@domain-model";

defineProps<{
  index: number;
  productID: ProductID;
  surveyMethod: SurveyMethod;
}>();
</script>

<template>
  <div
    class="w-full max-w-lg rounded-lg border border-slate-300 p-6 font-light"
  >
    <div
      class="mb-6 flex flex-row items-center justify-between border-b border-gray-300 pb-3"
    >
      <p class="text-2xl font-light text-gray-900">
        {{ index }}. {{ surveyMethod.name }}
      </p>

      <p v-if="surveyMethod.unimplemented" class="text-lg text-yellow-500">
        Coming Soon
      </p>
      <button
        v-else
        class="rounded-lg bg-green-600 px-6 py-0.5 text-lg text-white"
      >
        Use
      </button>
    </div>

    <div class="mb-6">
      <p class="mb-2 text-xl">Use this if</p>
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
        <ul class="mb-2 list-decimal px-5 text-lg font-light text-yellow-700">
          <li
            v-for="productType in surveyMethod.productTypes"
            :key="productType"
          >
            {{ productType }}
          </li>
        </ul>

        <p class="mb-2">
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
