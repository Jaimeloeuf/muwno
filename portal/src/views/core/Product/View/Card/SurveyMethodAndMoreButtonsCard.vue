<script setup lang="ts">
import {
  SurveyMethodsRoute,
  MoreProductFeatureRoute,
} from "../../../../../router";
import type { ProductID } from "@domain-model";

defineProps<{ productID: ProductID }>();
</script>

<template>
  <div class="flex flex-col gap-6 sm:flex-row">
    <router-link
      :to="{
        name: SurveyMethodsRoute.name,
        params: { productID },
      }"
      class="flex w-full flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4"
    >
      Survey Methods

      <svg
        class="h-3 w-3 shrink-0 rotate-90 transition duration-150"
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
    </router-link>

    <router-link
      :to="{ name: MoreProductFeatureRoute.name, params: { productID } }"
      class="flex w-full flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4"
    >
      <span class="pr-4">More</span>

      <svg
        class="h-3 w-3 shrink-0 rotate-90 transition duration-150"
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
    </router-link>
  </div>
</template>
