<script setup lang="ts">
import { ref } from "vue";
import { useProduct, useUser } from "../../../../store";
import TopNavbar from "../../../shared/TopNavbar.vue";
import CopyProductIDCard from "./Card/CopyProductIDCard.vue";
import DownloadRawResponseButton from "./Card/DownloadRawResponseButton.vue";
import EditProductDetails from "./Card/EditProductDetails.vue";
import TransferProductButton from "./Card/TransferProductButton.vue";
import DeleteProductButton from "./Card/DeleteProductButton.vue";
import { type ProductID, Role } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const productStore = useProduct();
const product = ref(await productStore.getProduct(props.productID));

const userStore = useUser();
const user = await userStore.getUser();

const updateProduct = async () =>
  (product.value = await productStore.getProduct(props.productID));
</script>

<template>
  <div>
    <TopNavbar sideDrawer back>{{ product.name }}</TopNavbar>

    <div
      class="mx-auto flex max-w-2xl flex-col gap-12 xl:max-w-7xl xl:flex-row"
    >
      <div class="flex w-full flex-col gap-6">
        <p class="text-xl">More</p>

        <CopyProductIDCard :productID="product.id" />

        <DownloadRawResponseButton :product="product" />

        <EditProductDetails
          v-if="user.role === Role.OrgOwner || user.role === Role.OrgAdmin"
          :productID="product.id"
          @product-updated="updateProduct"
        />
      </div>

      <div
        v-if="user.role === Role.OrgOwner || user.role === Role.OrgAdmin"
        class="flex w-full flex-col gap-6"
      >
        <p class="text-xl text-red-600">Destructive Actions</p>

        <TransferProductButton
          v-if="user.role === Role.OrgOwner"
          :product="product"
        />

        <DeleteProductButton :product="product" />
      </div>
    </div>
  </div>
</template>
