<script setup lang="ts">
import muwno from "../shared/muwno.vue";
import { signupLink } from "../../utils/links";
</script>

<template>
  <div class="px-10 md:px-12 lg:px-16 xl:px-24">
    <div class="mb-6 max-w-2xl md:mb-12 lg:mb-20">
      <p class="text-2xl font-bold text-zinc-600 md:text-3xl lg:text-4xl">
        How does <muwno /> work?
      </p>
    </div>

    <div class="flex flex-col justify-between gap-6 pb-12 md:flex-row md:pb-24">
      <div class="w-full">
        <img
          src="../../assets/how/feedback-collection.svg"
          class="h-28 w-full pb-8 md:h-32"
        />
        <p class="pb-6 text-center text-2xl text-zinc-600">
          Feedback Collection
        </p>
        <p
          class="mx-auto max-w-md text-center font-light text-zinc-600 md:text-lg"
        >
          We help you collect your customers' feedback using our built in tools
          like QR code, email blasts, website / API integrations and more.
        </p>
      </div>

      <div class="w-full">
        <img
          src="../../assets/how/data-analysis.svg"
          class="h-28 w-full pb-8 md:h-32"
        />
        <p class="pb-6 text-center text-2xl text-zinc-600">Data Analysis</p>
        <p
          class="mx-auto max-w-md text-center font-light text-zinc-600 md:text-lg"
        >
          We analyse, group and rank your feedback based on importance using AI
          and our algorithms so you only see the useful actionable tasks for
          your business.
        </p>
      </div>

      <div class="w-full">
        <img
          src="../../assets/how/task-generation.svg"
          class="h-28 w-full pb-8 md:h-32"
        />
        <p class="pb-6 text-center text-2xl text-zinc-600">Refine Strategy</p>
        <p
          class="mx-auto max-w-md text-center font-light text-zinc-600 md:text-lg"
        >
          We help you track your progress over time and figure out what is the
          highest impact thing you can do to stay on track making more money.
        </p>
      </div>
    </div>

    <p class="w-full text-center">
      <a
        :href="signupLink"
        target="_blank"
        class="rounded-full bg-primary px-20 py-3 text-xl font-medium text-white hover:shadow-2xl"
      >
        Start FREE
      </a>
    </p>
  </div>
</template>
