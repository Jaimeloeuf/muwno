<script setup lang="ts">
import { useOrg } from "../../../store";
import { ProductRoute, AddProductRoute } from "../../../router";
import SideDrawer from "../../components/SideDrawer.vue";
import PMFLiveScoreCard from "./PMFLiveScoreCard.vue";

const orgStore = useOrg();

const orgDetails = await orgStore.getOrg();
const products = await orgStore.getAllProducts();
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">
        Products
        <span class="font-extralight"> ({{ products.length }}) </span>
        of <span class="font-medium">{{ orgDetails.name }}</span>
      </span>
    </div>

    <div class="md:mx-6">
      <div class="grid grid-cols-1 lg:grid-cols-2">
        <router-link
          :to="{ name: AddProductRoute.name }"
          class="m-6 inline-flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-8"
          :class="{
            'bg-white text-green-600 hover:bg-gray-100': products.length !== 0,
            'bg-green-600 text-white': products.length === 0,
          }"
        >
          <p class="text-4xl">Add a Product</p>

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

        <router-link
          v-for="product in products"
          :key="product.id"
          :to="{ name: ProductRoute.name, params: { productID: product.id } }"
          class="m-6 rounded-lg bg-slate-50 p-6 text-gray-900 shadow"
        >
          <p class="mb-2 text-4xl">{{ product.name }}</p>

          <div class="text-right">
            <PMFLiveScoreCard class="bg-white" :productID="product.id" />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
