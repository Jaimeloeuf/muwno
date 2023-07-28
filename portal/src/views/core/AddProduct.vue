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
  if (name.value === "") return alert("Product Name cannot be empty!");

  loaderStore.show();

  const { id } = await orgStore.createNewProduct(name.value, surveyMode);

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
      "Automatically survey your customers recurringly, by following your product's sprint/feature-release cycles.",
      "Use this for a quick feedback loop cycle, especially helpful for active product development.",
    ],
    descriptions: [
      "You will need to either do a one-off system integration to automatically upload your customers emails continuously or manually upload them reguarly.",
      "This will automatically send out surveys for you without your intervention at your selected automatic surveying rate.",
      "Once setup, all you need to do is improve your product based on the actionable insights and monitor your PMF Score over time.",
    ],
  },

  {
    id: 2,
    name: "Passive/Manual",
    productType: "Physical Products",
    productExamples: ["Cosmetics", "Clothing", "Bottled Drinks"],
    usecase: [
      "Get customers' feedback passively without reaching out to them through our email surveys.",
      "Use this if you do not have access to your customers' email for email blasts, for example by passively presenting the survey to them with a QR code on your product, or as a link on your website.",
      "If you do have your customer's emails but do not want to automatically survey them, you can also use this to do one-off survey blasts by manually uploading your customers' email.",
    ],
    descriptions: [
      "With Passive mode, you will get a survey link + QR code for you to share it to your customers however you want.",
      "With Passive mode, you can do one-off email survey blasts, by manually uploading your customers' email.",
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
