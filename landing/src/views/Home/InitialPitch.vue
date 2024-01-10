<script setup lang="ts">
import muwno from "../shared/muwno.vue";
</script>

<template>
  <div class="px-10 md:px-12 lg:px-16 xl:px-24">
    <div
      class="flex flex-col items-center justify-between gap-4 pb-16 sm:pb-20 lg:flex-row lg:gap-12 xl:gap-24"
    >
      <img
        src="../../assets/feedback.png"
        class="h-full w-full min-w-0 max-w-screen-sm basis-1/2"
      />

      <div class="w-full max-w-screen-sm basis-1/2">
        <div
          class="pb-4 text-2xl font-semibold tracking-wide text-zinc-800 xl:pb-8 xl:text-4xl"
        >
          <p class="pb-2">
            You know it is important to
            <span class="text-primary">understand your customers.</span>
          </p>
          <p>Without it, businesses and products fail.</p>
        </div>

        <p class="text-lg font-light xl:text-2xl">
          Everyone knows that having a feedback loop is extremely important, but
          it is hard to do customer feedback right, and even harder to do it
          right consistently.
        </p>
      </div>
    </div>

    <div class="max-w-screen-sm">
      <p
        class="pb-2 text-2xl font-semibold tracking-wide text-zinc-800 xl:pb-8 xl:text-3xl"
      >
        <muwno /> helps you understand your customers so you can
      </p>
      <ol class="list-decimal space-y-3 px-5 text-lg xl:text-xl">
        <li>
          <span class="font-semibold text-primary">Reduce churn.</span>
        </li>
        <li>
          <span class="font-semibold text-primary">Unlock more customers</span>
          like your existing happy customers by targeting them better once you
          understand what existing happy customers value.
        </li>
        <li>
          <span class="font-semibold text-primary">
            Predict and forecast what to do next
          </span>
          by understanding whats important to your most valuable group of
          customers.
        </li>
      </ol>
    </div>

    <!-- <div class="text-center">
      <a
        :href="signupLink"
        target="_blank"
        class="whitespace-pre rounded-full bg-primary px-20 py-4 text-xl font-medium text-white hover:shadow-2xl"
      >
        Start FREE
      </a>
    </div> -->
  </div>
</template>
