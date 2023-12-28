<script setup lang="ts">
import { useProduct } from "../../../../store";
import {
  UserPersonaRoute,
  BenefitsRoute,
  SurveyStatsRoute,
  SurveyMethodsRoute,
  MoreProductFeatureRoute,
} from "../../../../router";

import TopNavbar from "../../../shared/TopNavbar.vue";
import RouteEnterButton from "../../../shared/RouteEnterButton.vue";
import PMFChart from "./PMFChart.vue";
import PMFLiveScoreCard from "./Card/PMFLiveScoreCard.vue";
import TaskCard from "./Card/TaskCard.vue";
import SurveyLinkCard from "./Card/SurveyLinkCard.vue";

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

    <div class="flex flex-col gap-6 xl:flex-row">
      <div class="sm:px-2 xl:basis-2/3">
        <p v-if="product.description !== ''" class="pb-6 font-extralight">
          {{ product.description }}
        </p>
        <PMFLiveScoreCard class="mb-6 max-w-md" :productID="product.id" />
        <PMFChart :productID="product.id" />
      </div>

      <div class="flex flex-col gap-6 xl:basis-1/3">
        <SurveyLinkCard :product="product" />
        <TaskCard :productID="product.id" />

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RouteEnterButton
            :to="{ name: UserPersonaRoute.name, params: { productID } }"
          >
            User Personas
          </RouteEnterButton>
          <RouteEnterButton
            :to="{ name: BenefitsRoute.name, params: { productID } }"
          >
            Benefits
          </RouteEnterButton>
          <RouteEnterButton
            :to="{ name: SurveyStatsRoute.name, params: { productID } }"
          >
            Survey Stats
          </RouteEnterButton>
          <RouteEnterButton
            :to="{ name: SurveyMethodsRoute.name, params: { productID } }"
          >
            Survey Methods
          </RouteEnterButton>
          <RouteEnterButton
            :to="{ name: MoreProductFeatureRoute.name, params: { productID } }"
          >
            More
          </RouteEnterButton>
        </div>
      </div>
    </div>
  </div>
</template>
