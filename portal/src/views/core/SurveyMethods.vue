<script setup lang="ts">
import { ref, computed } from "vue";
import { useOrg } from "../../store";
import SideDrawer from "../components/SideDrawer.vue";
import SurveyMethodCard from "./SurveyMethodCard.vue";
import { type ProductID, SurveyMethodsArray } from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const orgStore = useOrg();

const product = orgStore.getProduct(props.productID);

// @todo Load from API using product ID
const surveyMethodsStatus: Record<number, boolean> = {
  1: true,
  2: false,
  3: false,
  4: false,
  5: false,
};

const surveyMethodFilter = ref<"all" | "active" | "inactive">("all");

const filteredSurveyMethods = computed(() => {
  switch (surveyMethodFilter.value) {
    case "all":
      return SurveyMethodsArray;

    case "active":
      return SurveyMethodsArray.filter(
        (surveyMethod) => surveyMethodsStatus[surveyMethod.id]
      );

    case "inactive":
      return SurveyMethodsArray.filter(
        (surveyMethod) =>
          !surveyMethodsStatus[surveyMethod.id] && !surveyMethod.unimplemented
      );

    default:
      throw new Error(
        `Cannot filter survey methods with '${surveyMethodFilter.value}'`
      );
  }
});
</script>

<template>
  <div>
    <div class="mb-6 border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">
        <b>{{ product.name }}</b> <span class="font-light">Survey Methods</span>
      </span>
    </div>

    <div class="md:mx-6">
      <p class="mb-6 text-xl">
        <b>Survey Methods</b> is how <i>thepmftool</i> helps you to gather
        feedback. You can choose what to use based on the type of your product.
      </p>

      <div class="mb-4 flex flex-col gap-6 md:flex-row">
        <button
          class="w-full rounded-lg border p-2"
          :class="{
            'border-blue-700 text-blue-700': surveyMethodFilter === 'all',
          }"
          @click="surveyMethodFilter = 'all'"
        >
          All
        </button>
        <button
          class="w-full rounded-lg border p-2"
          :class="{
            'border-blue-700 text-blue-700': surveyMethodFilter === 'active',
          }"
          @click="surveyMethodFilter = 'active'"
        >
          Active
        </button>
        <button
          class="w-full rounded-lg border p-2"
          :class="{
            'border-blue-700 text-blue-700': surveyMethodFilter === 'inactive',
          }"
          @click="surveyMethodFilter = 'inactive'"
        >
          Inactive
        </button>
      </div>

      <p class="mb-6 text-lg">
        <template v-if="surveyMethodFilter === 'all'">
          All Survey Methods, including upcoming ones
        </template>
        <template v-if="surveyMethodFilter === 'active'">
          Active Survey Methods that are being used right now
        </template>
        <template v-if="surveyMethodFilter === 'inactive'">
          Survey Methods that are not in use
        </template>
        ({{ filteredSurveyMethods.length }})
      </p>

      <div
        class="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-stretch"
      >
        <SurveyMethodCard
          v-for="(surveyMethod, i) in filteredSurveyMethods"
          :key="surveyMethod.id"
          :index="i + 1"
          :surveyMethod="surveyMethod"
          :enabled="surveyMethodsStatus[surveyMethod.id] ?? false"
        />
      </div>
    </div>
  </div>
</template>
