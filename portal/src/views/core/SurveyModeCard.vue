<script setup lang="ts">
import type { SurveyModeDescription } from "domain-model";

defineProps<{ surveyModeDescription: SurveyModeDescription }>();
</script>

<template>
  <div
    class="group relative w-full max-w-lg cursor-pointer rounded-lg border border-blue-300 p-6 font-light hover:border-blue-600 hover:bg-slate-50 hover:shadow-xl lg:border-slate-300"
  >
    <p
      class="mb-6 border-b border-gray-300 pb-3 text-3xl font-light text-gray-900"
    >
      {{ surveyModeDescription.id }}. {{ surveyModeDescription.name }}
    </p>

    <div class="mb-6 border-b border-gray-300 pb-6">
      <p class="text-2xl">Your Product Type</p>
      <p class="mb-2 text-xl font-light text-yellow-700">
        {{ surveyModeDescription.productType }}
      </p>

      <p class="mb-2">Examples of product in this category:</p>
      <ul class="list-decimal px-5">
        <li
          v-for="example in surveyModeDescription.productExamples"
          :key="example"
        >
          {{ example }}
        </li>
      </ul>
    </div>

    <div class="mb-6 border-b border-gray-300 pb-6">
      <p class="text-2xl">What is this survey mode used for?</p>
      <ul class="list-decimal px-5">
        <li v-for="usecase in surveyModeDescription.usecase" :key="usecase">
          {{ usecase }}
        </li>
      </ul>
    </div>

    <div class="mb-10">
      <p class="text-2xl">How does this mode work?</p>
      <ul class="list-decimal px-5">
        <li
          v-for="modeDescriptionPoint in surveyModeDescription.descriptions"
          :key="modeDescriptionPoint"
        >
          {{ modeDescriptionPoint }}
        </li>
      </ul>
    </div>

    <svg
      class="absolute bottom-4 right-6 h-8 w-8 text-gray-700"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 10"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        d="M1 5h12m0 0L9 1m4 4L9 9"
      />
    </svg>
  </div>
</template>
