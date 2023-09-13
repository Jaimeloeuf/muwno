<script setup lang="ts">
import type { Product } from "@domain-model";

defineProps<{ product: Product }>();

// @todo
// tldr; stats on survey method distribution results + response performance
//
// This should be basic stats like how many survey opens and how many responses
// it should not be of individual ones?
// and this should be across a time period like 7 days or something
</script>

<template>
  <!-- @todo On click this will go to page with more in depth analytics -->
  <router-link :to="{}" class="cursor-pointer rounded-lg bg-zinc-100 p-4">
    <p class="text-sm font-medium">
      Survey Stats
      <span class="ml-1 font-light">(click for more)</span>
    </p>

    <!-- @todo Above 15% show green -->
    <!-- <div class="mb-2 pb-2">
      <p class="text-xl text-lime-600">21% response rate</p>
      <p class="text-lg">{{ 100 }} surveys sent, {{ 21 }} responded.</p>
    </div> -->
  </router-link>
</template>
