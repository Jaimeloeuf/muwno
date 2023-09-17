<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import { useProduct } from "../../store";
import BackButton from "../components/BackButton.vue";
import type {
  ProductID,
  FeedbackResponseID,
  FeedbackResponse,
} from "@domain-model";

const props = defineProps<{
  productID: ProductID;
  responseID: FeedbackResponseID;
}>();

const productStore = useProduct();

const product = await productStore.getProduct(props.productID);

const { res, err } = await sf
  .useDefault()
  .GET(`/feedback/response/${props.responseID}`)
  .useHeader(getAuthHeader)
  .runJSON<{ response: FeedbackResponse }>();

if (err) throw err;
if (!res.ok) throw new Error("Failed to load Survey Response");

const { response } = res.data;
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row items-center border-b pb-4">
      <BackButton />
      <span class="ml-4 text-4xl">
        <b>{{ product.name }}</b>
        <span class="font-light"> Survey Response</span>
      </span>
    </div>

    <div class="flex flex-col items-center justify-between md:mx-6 lg:flex-row">
      {{ response }}
    </div>
  </div>
</template>
