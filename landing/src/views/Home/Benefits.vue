<script setup lang="ts">
import muwno from "../shared/muwno.vue";
import { signupLink } from "../../utils/links";
</script>

<template>
  <div class="px-10 md:px-12 lg:px-16 xl:px-24">
    <div class="max-w-2xl pb-8 md:pb-12 lg:pb-20">
      <p class="text-2xl font-bold text-zinc-600 md:text-3xl lg:text-4xl">
        <muwno /> Gives You
      </p>
    </div>

    <div class="flex flex-col justify-between gap-8 pb-12 md:flex-row md:pb-20">
      <div class="w-full">
        <img
          src="../../assets/benefits/clock.svg"
          class="h-28 w-full pb-8 md:h-32"
        />
        <p
          class="mx-auto max-w-md text-center text-xl font-light text-zinc-600 md:text-2xl"
        >
          <span class="font-semibold">More money and time</span> by
          understanding what your customers will pay for and only focusing on
          those.
        </p>
      </div>

      <div class="w-full">
        <img
          src="../../assets/benefits/feedback-loop.svg"
          class="h-28 w-full pb-8 md:h-32"
        />
        <p
          class="mx-auto max-w-md text-center text-xl font-light text-zinc-600 md:text-2xl"
        >
          <span class="font-semibold">Super fast feedback loops</span> to help
          you always stay focused on doing what your customers would pay for.
        </p>
      </div>

      <div class="w-full">
        <img
          src="../../assets/benefits/star.svg"
          class="h-28 w-full pb-8 md:h-32"
        />
        <p
          class="mx-auto max-w-md text-center text-xl font-light text-zinc-600 md:text-2xl"
        >
          Simple and clear breakdown of your customers so you know who are your
          <span class="font-semibold">most important customers.</span>
        </p>
      </div>
    </div>

    <div class="text-center">
      <a
        :href="signupLink"
        target="_blank"
        class="whitespace-pre rounded-full bg-primary px-20 py-4 text-xl font-medium text-white hover:shadow-2xl"
      >
        Start FREE
      </a>
    </div>
  </div>
</template>
