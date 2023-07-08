<script setup lang="ts">
import type { Product } from "../../../types";

defineProps<{ product: Product }>();
</script>

<template>
  <div class="inline-block w-full rounded-lg bg-slate-50 p-4 shadow">
    <p class="text-sm font-medium">Product</p>

    <div class="text-right">
      <p class="text-4xl font-light">
        {{ product.name }}
      </p>
    </div>
  </div>
</template>
