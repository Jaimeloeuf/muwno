<script setup lang="ts">
import { useOrg } from "../../store";
import SideDrawer from "../components/SideDrawer.vue";
import PMFChart from "./PMFChart.vue";
import PMFLiveScoreCard from "./KeyInfoCard/PMFLiveScoreCard.vue";
import MITCard from "./KeyInfoCard/MITCard.vue";
import SurveyModeStatsCard from "./KeyInfoCard/SurveyModeStatsCard.vue";
import SurveyLinkCard from "./KeyInfoCard/SurveyLinkCard.vue";
import type { Product } from "@domain-model";

const props = defineProps<{ productID: Product["id"] }>();

const orgStore = useOrg();
const product = orgStore.getProduct(props.productID);

// Auto refresh runs once every 24 hours.
// This is a quick and easy but ugly way to do it by reloading the entire page.
setInterval(() => window.location.reload(), 8.64e7);
</script>

<template>
  <div>
    <div class="mb-6">
      <SideDrawer />
      <span class="ml-4 text-4xl font-light">{{ product.name }}</span>
    </div>

    <div class="flex flex-col-reverse lg:flex-row">
      <PMFChart class="m-4 my-12 grow lg:m-12" :product="product" />

      <div class="mx-4 flex max-w-lg flex-col space-y-6 lg:mx-0 lg:basis-1/4">
        <PMFLiveScoreCard class="w-full" :productID="product.id" />
        <MITCard :productID="product.id" />
        <SurveyModeStatsCard :product="product" />
        <SurveyLinkCard :product="product" />
      </div>
    </div>
  </div>
</template>
