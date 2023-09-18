<script setup lang="ts">
import { useProduct } from "../../../../store";
import BackButton from "../../../components/BackButton.vue";
import DownloadRawResponseButton from "./Card/DownloadRawResponseButton.vue";
import ApiKeyViewButton from "./Card/ApiKeyViewButton.vue";
import type { ProductID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const productStore = useProduct();
const product = await productStore.getProduct(props.productID);
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row items-center border-b pb-4">
      <BackButton />
      <span class="ml-4 text-4xl font-light">{{ product.name }}</span>
    </div>

    <div class="mx-auto flex max-w-lg flex-col gap-6">
      <p class="text-3xl">More Features</p>
      <DownloadRawResponseButton :product="product" />
      <ApiKeyViewButton :productID="product.id" />
    </div>
  </div>
</template>
