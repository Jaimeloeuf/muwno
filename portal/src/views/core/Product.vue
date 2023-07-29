<script setup lang="ts">
import { ref, watch } from "vue";
import { useOrg } from "../../store";
import SideDrawer from "../components/SideDrawer.vue";
import PMFChart from "./PMFChart.vue";
import ProductCard from "./KeyInfoCard/ProductCard.vue";
import PMFLiveScoreCard from "./KeyInfoCard/PMFLiveScoreCard.vue";
import SamplingDetailsCard from "./KeyInfoCard/SamplingDetailsCard.vue";
import MIT from "./MIT.vue";
import type { Product } from "domain-model";

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
      <span class="ml-4 text-4xl">Home</span>
    </div>

    <div class="flex flex-col-reverse lg:flex-row">
      <PMFChart class="m-4 my-12 grow lg:m-12" :product="product" />

      <div class="mx-4 flex flex-col space-y-6 lg:mx-0 lg:basis-1/4">
        <div
          class="w-full rounded-lg bg-slate-50 p-3 text-sm font-medium text-gray-700 shadow"
        >
          <label class="cursor-pointer select-none">
            <input
              v-model="autoRefresh"
              type="checkbox"
              class="mr-2 accent-green-500"
            />
            click to auto refresh daily
          </label>
        </div>

        <ProductCard :product="product" />
        <div class="flex flex-row space-x-8">
          <PMFLiveScoreCard class="w-full" :productID="product.id" />
        </div>
        <MIT :productID="product.id" />
        <!-- @todo -->
        <SamplingDetailsCard
          :samplingDetails="{
            rate: 1,
            size: 1,
            maxSampleCount: 1,
            coolOff: 1,
          }"
        />
      </div>
    </div>
  </div>
</template>
