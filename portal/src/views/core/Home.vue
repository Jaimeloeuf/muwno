<script setup lang="ts">
import SideDrawer from "../components/SideDrawer.vue";
import Chart from "./Chart.vue";
import ProductCard from "./KeyInfoCard/ProductCard.vue";
import SprintNumberCard from "./KeyInfoCard/SprintNumberCard.vue";
import PMFScoreCard from "./KeyInfoCard/PMFScoreCard.vue";
import MIT from "./MIT.vue";
</script>

<template>
  <div>
    <div class="mb-6">
      <SideDrawer />
      <span class="ml-4 text-4xl">Home</span>
    </div>

    <div>
      <div class="m-12 flex flex-row justify-end space-x-6">
        <MIT />
        <SprintNumberCard />
        <PMFScoreCard />
        <ProductCard />
      </div>

      <Chart />
    </div>
  </div>
</template>
