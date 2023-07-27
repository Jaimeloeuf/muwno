<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useOrg, useLoader } from "../../store";
import { ProductRoute } from "../../router";
import SideDrawer from "../components/SideDrawer.vue";

import type { SurveyMode, SurveyModeDescription } from "domain-model";
import SurveyModeCard from "./SurveyModeCard.vue";

const router = useRouter();
const orgStore = useOrg();
const loaderStore = useLoader();

const name = ref<string>("");

async function addProduct(surveyMode: SurveyMode) {
  // @todo Check inputs

  loaderStore.show();

  // @todo Call store method
  const { id } = await orgStore.createNewProduct({
    name: name.value,
  });

  if (surveyMode === 1) {
    // router.push({ name: ProductRoute.name, params: { productID: id } });
  } else if (surveyMode === 2) {
    router.push({ name: ProductRoute.name, params: { productID: id } });
  }

  loaderStore.hide();
}

const surveyModeDescriptions: Array<SurveyModeDescription> = [
  {
    id: 1,
    name: "Automatically Recurring",
    productType: "Software as a Service (SaaS)",
    productExamples: ["Spotify", "Netflix", "Instagram"],
    usecase: [
      "Mainly used for doing automatic and recurring surveying following product sprint/feature-release cycles.",
      "Use this if you want to have a quick feedback loop/cycle for active product development.",
    ],
    descriptions: [
      "This will automatically send out surveys for you without your intervention",
      "Note that for this to work you will need to either integrate your system to automatically upload emails of your customers continuously or manually update them reguarly",
    ],
  },

  {
    id: 2,
    name: "Passive/Manual",
    productType: "Physical Products",
    productExamples: ["Innisfree", "Sephora", "Cereals"],
    usecase: [
      "Mainly used for getting customer feedbacks without reaching out through email surveys.",
      "More of a customers reach out to do the survey",
      "You can also used for one off campaigns",
      "Use this if you do not have access to your customer's email for email blasts.",
    ],
    descriptions: [
      "With Passive mode, you create a survey link + QR code and you disseminate to your customers however you want",
      "As and when the customers decide to fill in your survey, you will get results",
      "With Passive mode, you can do one off email survey blasts, by manually importing in customers' email",
    ],
  },
];
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
            class="mt-4 w-full rounded-lg border border-gray-300 bg-slate-50 p-6"
            placeholder="Name"
          />
        </label>
      </div>

      <div class="mb-12">
        <p class="text-3xl">Choose Survey Mode</p>
        <ul class="list-decimal px-5">
          <li>
            Choose a <b>Survey Mode</b> based on the type of your product and
            how you want to gather feedback.
          </li>
        </ul>
      </div>
    </div>

    <div
      class="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-center"
    >
      <SurveyModeCard
        v-for="surveyMode in surveyModeDescriptions"
        :key="surveyMode.id"
        :surveyModeDescription="surveyMode"
        @click="addProduct(surveyMode.id)"
      />
    </div>
  </div>
</template>
