<script setup lang="ts">
import Chart from "./Chart.vue";
import SprintNumberCard from "./KeyInfoCard/SprintNumberCard.vue";
import PMFScoreCard from "./KeyInfoCard/PMFScoreCard.vue";
</script>

<template>
  <div>
    <div class="mb-6">
      <span class="ml-4 text-4xl">Home</span>
    </div>

    <!-- Row of key info cards -->
    <div class="m-12 flex flex-row justify-end space-x-6">
      <SprintNumberCard />
      <PMFScoreCard />
    </div>

    <Chart />
  </div>
</template>
