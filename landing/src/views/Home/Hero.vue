<script setup lang="ts">
import { signupLink } from "../../utils/links";
</script>

<template>
  <div
    class="flex flex-col-reverse items-center justify-between gap-6 px-10 md:flex-row md:px-12 lg:px-16 xl:px-24"
  >
    <div class="w-full">
      <p
        class="mb-4 text-4xl font-extrabold text-zinc-600 sm:text-5xl lg:text-7xl"
      >
        <span class="rounded-lg bg-yellow-300 px-2 text-zinc-700 shadow">
          Earn</span
        >
        with your customers'<br />
        feedback
      </p>

      <p class="mb-4 max-w-lg font-light md:text-lg">
        muwno generates tasks for you to do based on your customers' feedback so
        that you can sell more, earn more.
      </p>

      <a
        :href="signupLink"
        target="_blank"
        class="rounded-full bg-primary px-20 py-3 text-xl font-medium text-white"
      >
        Start
      </a>
    </div>

    <img
      class="h-64 w-full md:h-80 lg:h-96 xl:h-full"
      src="../../assets/hero.svg"
    />
  </div>
</template>
