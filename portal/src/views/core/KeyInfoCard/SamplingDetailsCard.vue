<script setup lang="ts">
import type { Product } from "../../../types";

defineProps<{ samplingDetails: Product["samplingDetails"] }>();
</script>

<template>
  <div class="inline-block w-full rounded-lg bg-slate-50 p-4 shadow">
    <p class="text-sm font-medium">Sampling Details</p>

    <div class="text-2xl font-extralight">
      <p>
        Rate: Once every <b>{{ samplingDetails.rate }}</b> sprints
      </p>
      <p>
        Period: <b>{{ samplingDetails.rate }}</b> sprints
      </p>
      <p>
        Size: <b>{{ samplingDetails.size }}</b> customers
      </p>
    </div>
  </div>
</template>
