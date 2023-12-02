<script setup lang="ts">
import { CustomerRoute, type RouteName } from "../../../router";
import {
  ManualEmailBlastRoute,
  WebsitePopupRoute,
  NotFoundRoute,
} from "../../../router";
import TopNavbar from "../../shared/TopNavbar.vue";
import SurveyMethodCard from "./SurveyMethodCard.vue";
import { flags } from "../../../utils/flags";
import {
  type ProductID,
  SurveyMethods,
  SurveyMethodsArray,
  ManualEmailBlast,
  WebsitePopup,
} from "@domain-model";

defineProps<{ productID: ProductID }>();

/** A mapping of SurveyMethodIDs to Route for that survey method  */
const routeMap = {
  [ManualEmailBlast.id]: ManualEmailBlastRoute.name,
  [WebsitePopup.id]: WebsitePopupRoute.name,
} as const satisfies Record<keyof typeof SurveyMethods, RouteName>;
</script>

<template>
  <div>
    <TopNavbar back>Survey Methods</TopNavbar>

    <div class="flex flex-col items-center justify-between lg:flex-row">
      <p class="pb-4 text-lg">
        <b>Survey Methods</b> is how <i>muwno</i> helps you gather feedback.
        <br />
        You can choose what to use based on the type of your product.
      </p>

      <router-link
        v-if="flags.devMode"
        :to="{ name: CustomerRoute.name }"
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

    <div class="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
      <SurveyMethodCard
        v-for="(surveyMethod, i) in SurveyMethodsArray"
        :key="surveyMethod.id"
        :index="i + 1"
        :productID="productID"
        :surveyMethod="surveyMethod"
        :routeName="routeMap[surveyMethod.id] ?? NotFoundRoute.name"
      />
    </div>
  </div>
</template>
