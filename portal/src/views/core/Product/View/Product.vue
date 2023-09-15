<script setup lang="ts">
import { useProduct } from "../../../../store";
import SideDrawer from "../../../components/SideDrawer.vue";
import PMFChart from "./PMFChart.vue";
import PMFLiveScoreCard from "./Card/PMFLiveScoreCard.vue";
import TaskCard from "./Card/TaskCard.vue";
// import SurveyStatsCard from "./Card/SurveyStatsCard.vue";
import SurveyLinkCard from "./Card/SurveyLinkCard.vue";
import CustomerAndSurveyMethodButtonsCard from "./Card/CustomerAndSurveyMethodButtonsCard.vue";
import MoreButton from "./Card/MoreButton.vue";
import type { ProductID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const productStore = useProduct();
const product = await productStore.getProduct(props.productID);

// Auto refresh runs once every 24 hours.
// This is a quick and easy but ugly way to do it by reloading the entire page.
setInterval(() => window.location.reload(), 8.64e7);
</script>

<template>
  <div>
    <div class="mb-2">
      <SideDrawer />
      <span class="ml-4 text-4xl font-light">{{ product.name }}</span>
    </div>

    <div class="flex flex-col-reverse lg:flex-row">
      <PMFChart class="m-4 my-12 grow lg:m-12" :product="product" />

      <div class="mx-4 flex max-w-lg flex-col space-y-6 lg:mx-0 lg:basis-1/4">
        <PMFLiveScoreCard class="w-full" :productID="product.id" />
        <TaskCard :productID="product.id" />
        <SurveyLinkCard :product="product" />
        <!-- <SurveyStatsCard :product="product" /> -->
        <CustomerAndSurveyMethodButtonsCard :productID="product.id" />
        <MoreButton :productID="product.id" />
      </div>
    </div>
  </div>
</template>
