<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  useProduct,
  useLoader,
  useNotif,
  useError,
} from "../../../../../store";
import { AllProductRoute } from "../../../../../router";
import type { Product } from "@domain-model";

const props = defineProps<{ product: Product }>();

const router = useRouter();
const productStore = useProduct();
const loader = useLoader();
const notif = useNotif();
const errorStore = useError();

const showConfirmationModal = ref(false);

async function deleteProduct() {
  showConfirmationModal.value = false;

  loader.show("Deleting Product and all its data ...");

  const result = await productStore.deleteProduct(props.product.id);

  loader.hide();

  if (result instanceof Error) {
    errorStore.newError(result);
    return;
  }

  notif.setSnackbar(`Deleted product '${props.product.name}'`);
  router.push({ name: AllProductRoute.name });
}
</script>

<template>
  <div>
    <div
      v-if="showConfirmationModal"
      class="fixed left-0 top-0 z-30 flex h-screen w-screen flex-col items-center justify-center bg-white p-8"
    >
      <div class="flex flex-col font-light">
        <p class="text-2xl">
          Permanently Delete <b>{{ product.name }}</b>
        </p>
        <p class="pb-4 text-lg">
          All data related to this product
          <u>will be permanently deleted</u> and cannot be recovered.
        </p>

        <div class="flex flex-row justify-between gap-6">
          <button
            class="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600"
            @click="deleteProduct"
          >
            Delete
          </button>

          <button
            class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2"
            @click="showConfirmationModal = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <button
      class="w-full rounded-lg border border-red-200 bg-red-50 p-3 text-left text-red-600"
      @click="showConfirmationModal = true"
    >
      Delete
    </button>
  </div>
</template>
