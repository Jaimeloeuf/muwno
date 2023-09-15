<script setup lang="ts">
import { useOrg, useProduct } from "../../../../store";
import { ProductRoute, AddProductRoute } from "../../../../router";
import SideDrawer from "../../../components/SideDrawer.vue";
import SimplePMFLiveScoreCard from "./SimplePMFLiveScoreCard.vue";

const orgStore = useOrg();
const productStore = useProduct();

const orgDetails = await orgStore.getOrg();
const products = await productStore.getAllProducts();
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
      <div
        class="mx-6 mb-8 flex flex-row items-end justify-between pb-6"
        :class="{ 'border-b border-zinc-200': true }"
      >
        <div class="w-full">
          <p class="font-medium">Product Name</p>
          <div class="flex max-w-md flex-row gap-3">
            <input
              type="text"
              class="w-full rounded-lg border border-gray-200 p-3"
              :placeholder="`E.g. ${products[0]?.name ?? 'Spotify'}`"
            />

            <button class="rounded-lg bg-slate-100 px-6">search</button>
          </div>
        </div>

        <div class="flex-shrink-0">
          <router-link
            :to="{ name: AddProductRoute.name }"
            class="inline-flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-6 py-2"
            :class="{
              'bg-white text-green-600 ': products.length !== 0,
              'bg-green-600 text-white': products.length === 0,
            }"
          >
            <p class="pr-6 text-2xl">Add Product</p>

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

      <div class="grid grid-cols-1 xl:grid-cols-2">
        <router-link
          v-for="product in products"
          :key="product.id"
          :to="{ name: ProductRoute.name, params: { productID: product.id } }"
          class="m-6 rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-gray-900"
        >
          <div class="flex flex-row justify-between">
            <p class="p-3 pr-4 text-3xl">{{ product.name }}</p>
            <SimplePMFLiveScoreCard :productID="product.id" />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
