<script setup lang="ts">
import { useOrg } from "../../store";
import { ProductRoute } from "../../router";
import SideDrawer from "../components/SideDrawer.vue";
import PMFScoreCard from "./KeyInfoCard/PMFScoreCard.vue";

const orgStore = useOrg();
</script>

<template>
  <div>
    <div class="mb-6">
      <SideDrawer />
      <span class="ml-4 text-4xl">Organisation Home</span>
    </div>

    <div class="mx-6">
      <p class="text-3xl">Products ({{ orgStore.productsArray.length }})</p>

      <div class="grid grid-cols-1 lg:grid-cols-2">
        <router-link
          v-for="product in orgStore.productsArray"
          :key="product.id"
          :to="{ name: ProductRoute.name, params: { productID: product.id } }"
          class="m-6 rounded-lg bg-slate-50 p-6 text-gray-900 shadow"
        >
          <p class="text-4xl">{{ product.name }}</p>

          <div class="text-right">
            <PMFScoreCard class="max-w-min bg-white" :score="product.score" />
          </div>
        </router-link>

        <!-- Create product card button -->
        <router-link
          :to="{}"
          class="m-6 inline-flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-8 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
          :class="{
            'bg-green-600 text-white hover:bg-green-600 hover:text-white':
              orgStore.productsArray.length === 0,
          }"
        >
          <div class="text-2xl">Add a Product</div>
          <svg
            class="h-8 w-8"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>
