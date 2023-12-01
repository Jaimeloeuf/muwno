<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProduct, useLoader } from "../../../store";
import { ProductRoute } from "../../../router";
import TopNavbar from "../../shared/TopNavbar.vue";

const router = useRouter();
const productStore = useProduct();
const loader = useLoader();

const name = ref<string>("");
const description = ref<string>("");

async function addProduct() {
  if (name.value === "") return alert("Product Name cannot be empty!");

  if (
    Object.values(productStore.products).some(
      (product) => product.name === name.value
    ) &&
    !confirm(
      "Product Name is already used, are you sure you want to add a new Product with the same name?"
    )
  )
    return;

  loader.show();

  const { id } = await productStore.createNewProduct(
    name.value,
    description.value
  );

  router.push({ name: ProductRoute.name, params: { productID: id } });

  loader.hide();
}
</script>

<template>
  <div>
    <TopNavbar back>Add Product</TopNavbar>

    <div class="mx-auto w-full max-w-lg">
      <div class="pb-10">
        <label>
          <p class="text-3xl">Product Name</p>
          <p>This is what your customer's will see</p>

          <input
            v-model.trim="name"
            type="text"
            class="mt-4 w-full rounded-lg border border-zinc-200 p-4 focus:outline-none"
            placeholder="For example, Spotify"
            @keydown.enter="addProduct"
          />
        </label>
      </div>

      <div class="pb-10">
        <label>
          <p class="text-3xl">
            Description <span class="pl-3 text-2xl font-thin">*Optional</span>
          </p>
          <ul class="list-decimal px-5">
            <li>This is not shown to your customers.</li>
            <li>
              Give a short internal description of your product if you want to
              create multiple products of the same name.
            </li>
            <li>
              Useful if you need to create multiple products of the same name
              for different customer groups, e.g. Facebook can have 2 products,
              1 for its users and 1 for its advertisers, both using the same
              product name 'Facebook'.
            </li>
          </ul>

          <textarea
            v-model.trim="description"
            rows="2"
            class="mt-4 w-full resize-none rounded-lg border border-zinc-200 p-4 focus:outline-none"
            placeholder="E.g. This 'Facebook' product is used to survey our advertisers."
          >
          </textarea>
        </label>
      </div>

      <div>
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
