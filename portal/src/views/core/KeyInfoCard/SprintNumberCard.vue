<script setup lang="ts">
import type { Product } from "domain-model";

defineProps<{ currentSprint: Product["currentSprint"] }>();
</script>

<template>
  <div class="inline-block w-full rounded-lg bg-slate-50 p-4 shadow">
    <p class="text-sm font-medium">Current Sprint</p>

    <div class="text-right">
      <p class="text-4xl font-light">
        {{ currentSprint }}
      </p>
    </div>
  </div>
</template>
