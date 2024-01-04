<script setup lang="ts">
import { signupLink } from "../../utils/links";
</script>

<template>
  <div
    class="flex h-screen w-full flex-col justify-center bg-zinc-50 px-8 md:px-24 lg:px-44"
  >
    <div class="flex flex-col items-center">
      <p
        class="pb-4 text-5xl font-medium sm:pb-12 sm:text-center sm:text-6xl xl:text-7xl"
      >
        We made
        <span
          class="underline decoration-zinc-600 decoration-4 underline-offset-8"
          >Feedback</span
        >

        <span class="block py-2"></span>

        <!-- @todo Or just link to a single blog post talking about all 3 points -->
        <!-- <span class="font-normal">Better, Faster, Cheaper.</span> -->

        <!-- @todo link each keyword to a blog post -->
        <span class="font-normal">
          <span
            class="hover:text-primary hover:underline hover:decoration-primary"
            >Better</span
          >,
          <span
            class="hover:text-primary hover:underline hover:decoration-primary"
            >Faster</span
          >,
          <span
            class="hover:text-primary hover:underline hover:decoration-primary"
            >Cheaper</span
          >.
        </span>
      </p>

      <p
        class="max-w-sm pb-8 font-light sm:max-w-md sm:text-center md:pb-12 md:text-lg xl:max-w-2xl xl:text-xl"
      >
        muwno collects and analyzes your customers' feedback to give you
        actionable tasks, so that you can grow your business and earn more.
      </p>

      <a
        :href="signupLink"
        target="_blank"
        class="rounded-full bg-primary px-20 py-3 text-xl font-light text-white hover:shadow-2xl sm:text-2xl"
      >
        START FREE
      </a>

      <p class="pt-4 text-center text-sm font-extralight">
        Get started within 2 minutes with no <br />
        technical knowledge required.
      </p>
    </div>
  </div>
</template>
