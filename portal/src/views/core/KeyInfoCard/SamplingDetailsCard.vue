<script setup lang="ts">
defineProps<{
  samplingDetails: {
    rate: number;
    size: number;
    maxSampleCount: number;
    coolOff: number;
  };
}>();
</script>

<template>
  <router-link
    :to="{}"
    class="inline-block w-full rounded-lg bg-slate-50 p-4 shadow hover:border hover:border-slate-400 hover:bg-white hover:shadow-xl"
  >
    <p class="text-sm font-medium">Sampling Details (click to edit)</p>

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
  </router-link>
</template>
