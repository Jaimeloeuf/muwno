<script setup lang="ts">
import { signupLink } from "../../utils/links";
</script>

<template>
  <div class="px-10 md:px-12 lg:px-16 xl:px-24">
    <div class="max-w-2xl pb-8 md:pb-12 lg:pb-20">
      <p class="text-2xl font-bold text-zinc-600 md:text-3xl lg:text-4xl">
        muwno gives you...
      </p>
    </div>

    <div class="flex flex-col justify-between gap-8 pb-12 md:flex-row">
      <div class="w-full">
        <img
          src="../../assets/benefits/feedback-loop.svg"
          class="h-28 w-full pb-8 md:h-32"
        />
        <p
          class="mx-auto max-w-md text-center text-xl font-light text-zinc-600 md:text-2xl"
        >
          <span class="font-semibold">Super fast feedback loops</span> that help
          you make more of what your customers would pay for.
        </p>
      </div>

      <div class="w-full">
        <img
          src="../../assets/benefits/clock.svg"
          class="h-28 w-full pb-8 md:h-32"
        />
        <p
          class="mx-auto max-w-md text-center text-xl font-light text-zinc-600 md:text-2xl"
        >
          <span class="font-semibold">More time</span> to focus and work on
          things that matter more.
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
          <span class="font-semibold">Gives you proof</span> that you are doing
          the right things for your customers.
        </p>
      </div>
    </div>

    <div class="text-center">
      <a
        :href="signupLink"
        target="_blank"
        class="whitespace-pre rounded-full bg-primary px-20 py-4 text-xl font-medium text-white"
      >
        Start Improving
      </a>
    </div>
  </div>
</template>
