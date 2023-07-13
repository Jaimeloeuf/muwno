<script setup lang="ts">
import { useOrg } from "../../store";
import SideDrawer from "../components/SideDrawer.vue";
import Chart from "./Chart.vue";
import ProductCard from "./KeyInfoCard/ProductCard.vue";
import SprintNumberCard from "./KeyInfoCard/SprintNumberCard.vue";
import PMFScoreCard from "./KeyInfoCard/PMFScoreCard.vue";
import SamplingDetailsCard from "./KeyInfoCard/SamplingDetailsCard.vue";
import MIT from "./MIT.vue";
import type { Product } from "domain-model";

const props = defineProps<{ productID: Product["id"] }>();

const orgStore = useOrg();
const product = orgStore.getProduct(props.productID);
</script>

<template>
  <div>
    <div class="mb-6">
      <SideDrawer />
      <span class="ml-4 text-4xl">Home</span>
    </div>

    <div class="flex flex-col-reverse lg:flex-row">
      <Chart class="m-4 my-12 grow lg:m-12" />

      <div class="mx-4 flex flex-col space-y-6 lg:mx-0 lg:basis-1/4">
        <ProductCard :product="product" />
        <SprintNumberCard :currentSprint="product.currentSprint" />
        <PMFScoreCard :score="product.score" />
        <SamplingDetailsCard :samplingDetails="product.samplingDetails" />
        <MIT />
      </div>
    </div>
  </div>
</template>
