<script setup lang="ts">
import { signupLink } from "../../utils/links";
</script>

<template>
  <div
    class="flex h-screen w-full flex-col justify-center bg-gradient-to-tr from-zinc-100 from-30% to-sky-50 to-100% px-8"
  >
    <div class="flex flex-col items-center gap-8 lg:gap-12">
      <p
        class="text-5xl text-zinc-900 sm:text-center sm:text-6xl lg:text-7xl xl:text-8xl"
      >
        <span class="font-light">We make feedback</span>

        <span class="block py-2"></span>

        <!-- @todo link to a single blog post talking about all 3 points -->
        <span
          class="inline-block bg-gradient-to-br from-black from-10% to-primary to-70% bg-clip-text font-semibold text-transparent hover:underline hover:decoration-black hover:decoration-4 hover:underline-offset-8"
          >Better, Faster, Cheaper.</span
        >
      </p>

      <p
        class="max-w-sm font-light text-zinc-800 sm:max-w-md sm:text-center sm:text-lg xl:max-w-2xl xl:text-xl"
      >
        muwno collects and analyzes your customers' feedback to give you
        actionable tasks, so you can grow your business and earn more.
      </p>

      <div class="pt-4">
        <a
          :href="signupLink"
          target="_blank"
          class="rounded-full bg-primary px-20 py-2.5 text-xl font-light text-white hover:shadow-2xl lg:py-3 lg:text-2xl"
        >
          START FREE
        </a>

        <p class="pt-6 text-center text-sm font-extralight text-zinc-700">
          Get started within 2 minutes with no <br />
          technical knowledge required.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Use this class to animate gradient text */
/* .animate-gradient {
  background-size: 1000%;
  animation: animatedgradient 3s ease infinite alternate;
  -webkit-animation: animatedgradient 3s ease infinite alternate;
  -moz-animation: animatedgradient 3s ease infinite alternate;
}

@keyframes animatedgradient {
  0% {
    background-position: 0%;
  }
  30% {
    background-position: 30%;
  }
  60% {
    background-position: 60%;
  }
  100% {
    background-position: 100%;
  }
} */
</style>
