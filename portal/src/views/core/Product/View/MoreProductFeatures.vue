<script setup lang="ts">
import { useProduct, useUser } from "../../../../store";
import BackButton from "../../../components/BackButton.vue";
import DownloadRawResponseButton from "./Card/DownloadRawResponseButton.vue";
import DeleteProductButton from "./Card/DeleteProductButton.vue";
import { type ProductID, Role } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const productStore = useProduct();
const product = await productStore.getProduct(props.productID);

const userStore = useUser();
const user = await userStore.getUser();
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

      <template
        v-if="user.role === Role.OrgOwner || user.role === Role.OrgAdmin"
      >
        <div class="py-6"></div>
        <DeleteProductButton :product="product" />
      </template>
    </div>
  </div>
</template>
