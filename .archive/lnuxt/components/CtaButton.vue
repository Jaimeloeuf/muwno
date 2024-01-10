<script setup lang="ts">
import { signupLink } from "../utils/links";
</script>

<template>
  <a
    :href="signupLink"
    target="_blank"
    class="flex w-full flex-row items-center justify-between gap-2 rounded-lg border border-zinc-200 p-8 shadow-xl outline-none"
  >
    <div class="w-full">
      <p class="pb-2 text-lg font-bold text-zinc-800 sm:text-2xl lg:text-4xl">
        <muwno /> costs less than
        <span
          class="underline decoration-primary decoration-2 underline-offset-4"
          >wasting time</span
        >.
      </p>

      <p class="sm:text-lg lg:text-2xl">So start right now for free.</p>
    </div>

    <svg
      class="h-6 w-6 shrink-0 rotate-90 text-primary sm:h-8 sm:w-8"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 6"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5 5 1 1 5"
      />
    </svg>
  </a>
</template>
