<script setup lang="ts">
import { ref } from "vue";
import { useOrg, useProduct } from "../../../../store";
import { ProductRoute, AddProductRoute } from "../../../../router";
import SideDrawerButton from "../../../components/SideDrawerButton.vue";
import SimplePMFLiveScoreCard from "./SimplePMFLiveScoreCard.vue";
import { useSearch } from "./SearchComposable";

const orgStore = useOrg();
const productStore = useProduct();

const org = await orgStore.getOrg();
const products = await productStore.getAllProducts();

const pmfLiveScoreCacheKey = Date.now().toString();

/** Ref to the DOM element so that it can be cleared by `clearSearchInputHandler` */
const searchField = ref<HTMLInputElement | null>(null);

const { searchInput, results, clearSearchInput } = useSearch(
  products,
  { keys: ["name"], threshold: 0.5, resultLimit: 5 },
  () => searchField.value?.focus()
);
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row border-b pb-4">
      <SideDrawerButton />
      <span class="ml-4 text-4xl">
        Products
        <span class="font-extralight"> ({{ products.length }}) </span>
        of <span class="font-medium">{{ org.name }}</span>
      </span>
    </div>

    <div class="md:mx-12">
      <div
        class="mb-8 flex flex-col justify-between gap-3 pb-6 sm:flex-row sm:items-end"
        :class="{ 'border-b border-zinc-200': true }"
      >
        <div class="w-full max-w-md">
          <p class="font-medium">Product Name</p>
          <div class="flex max-w-md flex-row gap-3">
            <input
              v-model="searchInput"
              type="text"
              class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-3 focus:outline-none"
              :placeholder="`E.g. ${products[0]?.name ?? 'Spotify'}`"
            />

            <button
              class="rounded-lg bg-zinc-100 px-4 font-light text-zinc-900"
              @click="clearSearchInput"
            >
              clear
            </button>
          </div>
        </div>

        <div class="flex-shrink-0">
          <router-link
            :to="{ name: AddProductRoute.name }"
            class="inline-flex cursor-pointer items-center justify-between rounded-lg border border-zinc-200 px-6 py-2"
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

      <p
        v-if="searchInput !== '' && results.length === 0"
        class="text-2xl font-extralight"
      >
        No products matches your search.
      </p>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <router-link
          v-for="product in results"
          :key="product.id"
          :to="{
            name: ProductRoute.name,
            params: { productID: product.id },
          }"
          class="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-zinc-900"
        >
          <div class="flex flex-col justify-between sm:flex-row">
            <p class="p-3 pr-4 text-3xl">{{ product.name }}</p>
            <SimplePMFLiveScoreCard
              :productID="product.id"
              :cacheKey="pmfLiveScoreCacheKey"
            />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
