<script setup lang="ts">
import { PricingRoute } from "../../router";
import { signupLink } from "../../utils/links";
</script>

<template>
  <div class="px-6 md:px-12 lg:px-16 xl:px-24">
    <p
      class="pb-4 text-3xl font-extrabold text-zinc-600 md:text-4xl lg:text-5xl"
    >
      Start Earning more right now for
      <span class="rounded-lg bg-yellow-300 px-2 text-zinc-700 shadow">
        FREE!</span
      >
    </p>

    <div>
      <p class="pb-4 text-lg font-light md:pb-12 md:text-2xl">
        Simple, Honest pricing with no hidden fees. Only pay what you use over
        the free tier.
      </p>
    </div>

    <div class="flex flex-col items-center justify-between gap-12 lg:flex-row">
      <div class="basis-2/3">
        <img src="../../assets/free.jpg" class="w-full" />
      </div>

      <div class="flex basis-1/3 flex-col gap-12 text-center">
        <div>
          <router-link
            :to="{ name: PricingRoute.name }"
            class="rounded-full border-2 border-primary px-20 py-3 font-semibold text-primary"
          >
            See Pricing
          </router-link>
        </div>

        <div>
          <a
            :href="signupLink"
            target="_blank"
            class="rounded-full bg-primary px-20 py-3 text-xl font-medium text-white hover:shadow-2xl"
          >
            Start FREE
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
