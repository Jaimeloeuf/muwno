<script setup lang="ts">
import { ApiKeyRoute } from "../../../../../router";
import type { ProductID } from "@domain-model";

defineProps<{ productID: ProductID }>();
</script>

<template>
  <router-link
    :to="{ name: ApiKeyRoute.name, params: { productID } }"
    class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left"
  >
    <span class="pr-4">Manage your API Keys</span>

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
</template>
