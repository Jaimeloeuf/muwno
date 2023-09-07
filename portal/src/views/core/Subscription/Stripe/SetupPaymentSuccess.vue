<script setup lang="ts">
import { AllProductRoute } from "../../../../router";
</script>

<template>
  <div class="mx-auto max-w-lg">
    <div class="mb-6">
      <p class="text-4xl font-light">Payment Success!</p>
    </div>

    <router-link
      :to="{ name: AllProductRoute.name }"
      class="w-full rounded-lg bg-green-600 p-1 text-2xl text-white"
    >
      Start
    </router-link>
  </div>
</template>
