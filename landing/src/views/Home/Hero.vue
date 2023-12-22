<script setup lang="ts">
import { signupLink } from "../../utils/links";
</script>

<template>
  <div
    class="flex flex-col-reverse items-center justify-between gap-6 px-10 pt-4 md:flex-row md:px-12 lg:px-16 xl:px-24 xl:pt-8"
  >
    <div class="w-full">
      <p
        class="mb-4 text-4xl font-extrabold text-zinc-600 sm:text-5xl md:mb-8 lg:text-7xl"
      >
        <span class="rounded-lg bg-yellow-300 px-2 text-zinc-700 shadow">
          Earn</span
        >
        with your customers'<br />
        feedback
      </p>

      <p class="max-w-lg pb-8 font-light md:pb-12 md:text-lg">
        muwno generates tasks for you to do based on your customers' feedback so
        that you can sell more, earn more.
      </p>

      <a
        :href="signupLink"
        target="_blank"
        class="rounded-full bg-primary px-20 py-3 text-xl font-medium text-white hover:shadow-2xl"
      >
        Start FREE
      </a>
    </div>

    <img
      class="h-64 w-full md:h-80 lg:h-96 xl:h-full"
      src="../../assets/hero.svg"
    />
  </div>
</template>
