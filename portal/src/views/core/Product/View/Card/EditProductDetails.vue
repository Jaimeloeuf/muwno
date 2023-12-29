<script setup lang="ts">
import { ref, computed } from "vue";
import {
  useProduct,
  useLoader,
  useNotif,
  useError,
} from "../../../../../store";
import { isLinkValidReactive } from "../../../../../utils/isLinkValid";
import type { ProductID } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();
const emit = defineEmits<{ (e: "product-updated"): void }>();

const productStore = useProduct();
const loader = useLoader();
const notif = useNotif();
const errorStore = useError();

const product = ref(await productStore.getProduct(props.productID));
const name = ref(product.value.name);
const description = ref(product.value.description);

// Need to transform to string first if null to ensure that the input can detect
// for value changes because if user input something and clear it, it becomes ""
// instead of null and it cant be compared to the original link value.
// It is a computed prop so that once product value is updated, this is also
// updated to ensure that the `isChanged` property is accurate.
const originalLink = computed(() => product.value.link ?? "");
const link = ref(originalLink.value);
const isLinkValid = isLinkValidReactive(link);

const isChanged = computed(
  () =>
    name.value !== product.value.name ||
    description.value !== product.value.description ||
    link.value !== originalLink.value
);

async function saveChanges() {
  if (link.value !== "" && !isLinkValid.value) {
    errorStore.newUserError("Please enter a valid link!");
    return;
  }
  if (name.value === "") {
    errorStore.newUserError("Product Name cannot be empty!");
    return;
  }
  if (
    Object.values(productStore.products).some(
      (product) => product.name === name.value && product.id !== props.productID
    ) &&
    !confirm(
      "Product Name is already used, are you sure you want to use the same name?"
    )
  )
    return;

  if (!confirm("Update?")) return;

  loader.show();

  await productStore.updateProduct(
    product.value.id,
    name.value,
    link.value === "" ? null : link.value,
    description.value
  );
  product.value = await productStore.getProduct(props.productID);
  emit("product-updated");

  loader.hide();

  notif.setSnackbar(`Saved changes to ${product.value.name}!`);
}
</script>

<template>
  <div class="rounded-lg border border-zinc-200 p-4 text-left">
    <p class="mb-4 w-full border-b pb-2">Edit Product Details</p>

    <div class="pb-4">
      <label>
        <p>Product Name</p>
        <p class="font-light">This is what your customer's will see</p>

        <input
          v-model.trim="name"
          type="text"
          class="mt-2 w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
          placeholder="Product Name"
        />
      </label>
    </div>

    <div class="pb-4">
      <label>
        <p>Link</p>
        <p class="font-light">
          Your product's link, users will be redirected here after they complete
          any of this product's feedback forms.
        </p>

        <input
          v-model.trim="link"
          type="text"
          class="mt-2 w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
          placeholder="E.g. https://example.com"
        />
        <p
          v-if="link !== '' && !isLinkValid"
          class="pl-2 pt-0.5 text-sm text-red-500"
        >
          Invalid link!
        </p>
      </label>
    </div>

    <div class="pb-4">
      <label>
        <p>Description <span class="font-extralight">*Optional</span></p>
        <ul class="list-decimal px-5 font-light">
          <li>This is not shown to your customers.</li>
          <li>
            Give a short internal description of your product if you want to
            create multiple products of the same name.
          </li>
          <li>
            Useful if you need to create multiple products of the same name for
            different customer groups, e.g. Facebook can have 2 products, 1 for
            its users and 1 for its advertisers, both using the same product
            name 'Facebook'.
          </li>
        </ul>

        <textarea
          v-model.trim="description"
          rows="2"
          class="mt-2 w-full resize-none rounded-lg border border-zinc-200 p-3 focus:outline-none"
          placeholder="E.g. This 'Facebook' product is used to survey our advertisers."
        ></textarea>
      </label>
    </div>

    <button
      class="w-full rounded-lg border py-1 text-center"
      :class="{
        'bg-green-600 text-white': isChanged,
        'bg-zinc-50 font-light text-zinc-500': !isChanged,
      }"
      :disabled="!isChanged"
      @click="saveChanges"
    >
      Save Changes
    </button>
  </div>
</template>
