<script setup lang="ts">
import type { SurveyMethod } from "@domain-model";

defineProps<{
  index: number;
  productID: ProductID;
  surveyMethod: SurveyMethod;
  enabled: boolean;
}>();
</script>

<template>
  <div
    class="w-full max-w-lg rounded-lg border border-slate-300 p-6 font-light"
  >
    <p
      class="mb-6 border-b border-gray-300 pb-3 text-3xl font-light text-gray-900"
    >
      {{ index }}. {{ surveyMethod.name }}
    </p>

    <div class="mb-6 border-b border-gray-300 pb-6">
      <p class="text-2xl">You should use this if your Product Type is</p>
      <p class="mb-2 text-xl font-light text-yellow-700">
        {{ surveyMethod.productType }}
      </p>

      <p class="mb-2">Examples of product in this category:</p>
      <ul class="list-decimal px-5">
        <li v-for="example in surveyMethod.productExamples" :key="example">
          {{ example }}
        </li>
      </ul>
    </div>

    <div class="mb-6 border-b border-gray-300 pb-6">
      <p class="text-2xl">What is this survey mode used for?</p>
      <ul class="list-decimal px-5">
        <li v-for="usecase in surveyMethod.usecase" :key="usecase">
          {{ usecase }}
        </li>
      </ul>
    </div>

    <div class="mb-6">
      <p class="text-2xl">How does this mode work?</p>
      <ul class="list-decimal px-5">
        <li
          v-for="modeDescriptionPoint in surveyMethod.descriptions"
          :key="modeDescriptionPoint"
        >
          {{ modeDescriptionPoint }}
        </li>
      </ul>
    </div>

    <p
      v-if="surveyMethod.unimplemented"
      class="text-center text-3xl text-yellow-500"
    >
      Coming Soon
    </p>

    <div v-else class="flex flex-col gap-3 sm:flex-row">
      <button
        v-if="enabled"
        class="w-full rounded-lg bg-red-600 p-3 text-2xl text-white"
      >
        disable
      </button>
      <button
        v-else
        class="w-full rounded-lg bg-green-600 p-3 text-2xl text-white"
      >
        enable
      </button>

      <button v-if="enabled" class="w-full rounded-lg bg-slate-200 p-3">
        <span class="mr-3 text-lg font-medium text-gray-800">edit</span>

        <svg
          class="inline-block h-6 w-6 text-gray-700"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 16 12"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
