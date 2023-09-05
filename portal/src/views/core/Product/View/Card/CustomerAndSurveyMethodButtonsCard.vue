<script setup lang="ts">
import { SurveyMethodsRoute } from "../../../../../router";
import type { Product } from "@domain-model";

defineProps<{ product: Product }>();
</script>

<template>
  <div class="flex flex-row justify-between gap-6">
    <!-- @todo fix link -->
    <router-link
      :to="{
        params: { productID: product.id },
      }"
      class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg bg-slate-50 p-4 text-left shadow hover:border hover:border-slate-300 hover:bg-white hover:shadow-lg"
    >
      Manage Customers

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
      :to="{
        name: SurveyMethodsRoute.name,
        params: { productID: product.id },
      }"
      class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg bg-slate-50 p-4 text-left shadow hover:border hover:border-slate-300 hover:bg-white hover:shadow-lg"
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
  </div>
</template>
