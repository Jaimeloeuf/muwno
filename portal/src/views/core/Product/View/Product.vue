<script setup lang="ts">
import { useProduct } from "../../../../store";
import TopNavbar from "../../../shared/TopNavbar.vue";
import PMFChart from "./PMFChart.vue";
import PMFLiveScoreCard from "./Card/PMFLiveScoreCard.vue";
import TaskCard from "./Card/TaskCard.vue";
import SurveyStatsCard from "./Card/SurveyStatsCard.vue";
import SurveyLinkCard from "./Card/SurveyLinkCard.vue";
import SurveyMethodAndMoreButtonsCard from "./Card/SurveyMethodAndMoreButtonsCard.vue";
import UserPersonaButton from "./Card/UserPersonaButton.vue";
import BenefitsButton from "./Card/BenefitsButton.vue";
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
    <TopNavbar sideDrawer>{{ product.name }}</TopNavbar>

    <div class="flex flex-col-reverse gap-6 xl:flex-row">
      <div class="grow sm:px-2 lg:basis-3/4">
        <p v-if="product.description !== ''" class="pb-6 font-extralight">
          {{ product.description }}
        </p>
        <PMFChart :productID="product.id" />
      </div>

      <div class="flex max-w-lg flex-col gap-6 lg:mx-0 lg:basis-1/4">
        <PMFLiveScoreCard :productID="product.id" />
        <TaskCard :productID="product.id" />
        <SurveyLinkCard :product="product" />
        <SurveyStatsCard :productID="product.id" />
        <UserPersonaButton :productID="product.id" />
        <BenefitsButton :productID="product.id" />
        <SurveyMethodAndMoreButtonsCard :productID="product.id" />
      </div>
    </div>
  </div>
</template>
