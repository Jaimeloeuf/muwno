<script setup lang="ts">
import CopyOnClick from "../../../../shared/CopyOnClick.vue";
import type { ProductID } from "@domain-model";

defineProps<{ productID: ProductID }>();
</script>

<template>
  <div class="w-full rounded-lg border border-zinc-200 p-3">
    <div
      class="mb-2 flex flex-row items-center justify-between border-b border-zinc-200 pb-1.5"
    >
      <p>Product ID</p>
      <CopyOnClick
        class="rounded-lg border border-zinc-200 bg-zinc-50 px-2 font-light text-zinc-900"
        :textToCopy="productID"
      >
        Copy
      </CopyOnClick>
    </div>

    <p class="break-all font-light">
      {{ productID }}
    </p>
  </div>
</template>
