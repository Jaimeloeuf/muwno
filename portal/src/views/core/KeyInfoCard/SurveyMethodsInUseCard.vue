<script setup lang="ts">
import { SurveyMethodsRoute } from "../../../router";
import { type Product, type SurveyMethod, SurveyMethods } from "@domain-model";

const props = defineProps<{ product: Product }>();

// @todo Load survey methods used, get them back sorted by latest enabled first
props.product.id;
const surveyMethods: Array<SurveyMethod["id"]> = [];
</script>

<template>
  <div class="w-full rounded-lg bg-slate-50 p-4 shadow">
    <div
      class="mb-2 flex flex-row items-center justify-between border-b border-slate-300 pb-2"
    >
      <p class="font-medium">Survey Methods</p>

      <router-link
        :to="{
          name: SurveyMethodsRoute.name,
          params: { productID: product.id },
        }"
        class="rounded-lg bg-slate-400 px-6 text-center text-white shadow-lg"
      >
        Manage
      </router-link>
    </div>

    <div v-if="surveyMethods.length === 0" class="text-2xl font-thin">
      Not using any, click to add Survey Methods.
    </div>

    <div v-else>
      <!-- @todo Click to edit the selected survey method -->
      <button
        v-for="(surveyMethod, i) in surveyMethods"
        :key="surveyMethod"
        class="mt-3 block w-full rounded-lg border border-slate-300 p-2 text-left text-xl font-light hover:bg-white hover:shadow-xl"
      >
        <span class="mr-2">{{ i + 1 }}.</span>
        {{ SurveyMethods[surveyMethod]?.name }}
      </button>
    </div>
  </div>
</template>
