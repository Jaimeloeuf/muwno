<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProduct, useLoader } from "../../../store";
import { ProductRoute } from "../../../router";
import SideDrawer from "../../components/SideDrawer.vue";

const router = useRouter();
const productStore = useProduct();
const loaderStore = useLoader();

const name = ref<string>("");

async function addProduct() {
  if (name.value === "") return alert("Product Name cannot be empty!");

  loaderStore.show();

  const { id } = await productStore.createNewProduct(name.value);

  router.push({ name: ProductRoute.name, params: { productID: id } });

  loaderStore.hide();
}
</script>

<template>
  <div>
    <div class="mb-12 border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">Add new Product</span>
    </div>

    <div class="mx-auto w-full max-w-lg">
      <div class="mb-10">
        <label>
          <p class="text-3xl">Product Name</p>
          <p>This is what your customer's will see</p>

          <input
            v-model="name"
            type="text"
            class="mt-4 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-6"
            placeholder="Product Name"
            @keydown.enter="addProduct"
          />
        </label>
      </div>

      <div class="mb-12">
        <button
          class="w-full rounded-lg border border-green-600 p-3 text-xl text-green-600"
          @click="addProduct"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>
