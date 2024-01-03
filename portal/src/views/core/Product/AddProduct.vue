<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProduct, useLoader, useError } from "../../../store";
import { ProductRoute } from "../../../router";
import { isLinkValidReactive } from "../../../utils/isLinkValid";
import TopNavbar from "../../shared/TopNavbar.vue";

const router = useRouter();
const productStore = useProduct();
const loader = useLoader();
const errorStore = useError();

const name = ref<string>("");
const description = ref<string>("");

const link = ref<string>("");
const isLinkValid = isLinkValidReactive(link);

async function addProduct() {
  if (name.value === "") {
    errorStore.newUserError("Product Name cannot be empty!");
    return;
  }
  if (link.value !== "" && !isLinkValid.value) {
    errorStore.newUserError("Please enter a valid link!");
    return;
  }

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

  const result = await productStore.createNewProduct(
    name.value,
    link.value === "" ? null : link.value,
    description.value
  );

  loader.hide();

  if (result instanceof Error) {
    errorStore.newError(result);
    return;
  }

  router.push({ name: ProductRoute.name, params: { productID: result.id } });
}
</script>

<template>
  <div>
    <TopNavbar sideDrawer back>Add Product</TopNavbar>

    <div class="mx-auto w-full max-w-lg">
      <div class="pb-10">
        <label>
          <p class="text-2xl">Product Name</p>
          <p>This is what your customer's will see</p>

          <input
            v-model.trim="name"
            type="text"
            class="mt-2 w-full rounded-lg border border-zinc-200 p-3 focus:outline-none"
            placeholder="For example, Spotify"
            @keydown.enter="addProduct"
          />
        </label>
      </div>

      <div class="pb-10">
        <label>
          <p class="text-2xl">
            Link <span class="pl-3 text-2xl font-thin">*Optional</span>
          </p>
          <p>
            Your product's link, users will be redirected here after they
            complete any of this product's feedback forms.
          </p>

          <input
            v-model.trim="link"
            type="text"
            class="mt-2 w-full rounded-lg border border-zinc-200 p-3 focus:outline-none"
            placeholder="E.g. https://example.com"
            @keydown.enter="addProduct"
          />
          <p
            v-if="link !== '' && !isLinkValid"
            class="pl-3 pt-0.5 text-sm text-red-500"
          >
            Invalid link!
          </p>
        </label>
      </div>

      <div class="pb-10">
        <label>
          <p class="text-2xl">
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
            class="mt-2 w-full resize-none rounded-lg border border-zinc-200 p-3 focus:outline-none"
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
