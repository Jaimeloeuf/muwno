<script setup lang="ts">
import type { Product } from "domain-model";

defineProps<{ product: Product }>();
</script>

<template>
  <router-link
    :to="{}"
    class="inline-block w-full rounded-lg bg-slate-50 p-4 shadow hover:border hover:border-slate-400 hover:bg-white hover:shadow-xl"
  >
    <p class="text-sm font-medium">Sampling Details (click to edit)</p>

    <div class="text-2xl font-extralight">
      <p>
        Rate: Once every <b>{{ product.samplingDetails.rate }}</b> sprints
      </p>
      <p>
        Period: <b>{{ product.samplingDetails.rate }}</b> sprints
      </p>
      <p>
        Size: <b>{{ product.samplingDetails.size }}</b> customers
      </p>
    </div>
  </router-link>
</template>
