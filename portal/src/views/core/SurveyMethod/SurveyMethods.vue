<script setup lang="ts">
import { useProduct } from "../../../store";
import { CustomerRoute } from "../../../router";
import BackButton from "../../components/BackButton.vue";
import SurveyMethodCard from "./SurveyMethodCard.vue";
import { type ProductID, SurveyMethodsArray } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const productStore = useProduct();

const product = await productStore.getProduct(props.productID);
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row items-center border-b pb-4">
      <BackButton />
      <span class="ml-4 text-4xl">
        <b>{{ product.name }}</b> <span class="font-light">Survey Methods</span>
      </span>
    </div>

    <div class="md:mx-6">
      <div class="flex flex-col items-center justify-between lg:flex-row">
        <p class="mb-2 text-xl">
          <b>Survey Methods</b> is how <i>thepmftool</i> helps you gather
          feedback.
          <br />
          You can choose what to use based on the type of your product.
        </p>

        <router-link
          :to="{
            name: CustomerRoute.name,
            params: { productID: product.id },
          }"
          class="mb-6 flex w-max flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left"
        >
          Import your customers to survey them

          <svg
            class="ml-4 h-3 w-3 shrink-0 rotate-90 transition duration-150"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </router-link>
      </div>

      <div
        class="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-stretch"
      >
        <SurveyMethodCard
          v-for="(surveyMethod, i) in SurveyMethodsArray"
          :key="surveyMethod.id"
          :index="i + 1"
          :productID="productID"
          :surveyMethod="surveyMethod"
        />
      </div>
    </div>
  </div>
</template>
