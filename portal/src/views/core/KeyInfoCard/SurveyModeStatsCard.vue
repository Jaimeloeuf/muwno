<script setup lang="ts">
import {
  SurveyMode,
  type Product,
  type AutoSurveyDetails,
} from "@domain-model";

const props = defineProps<{ product: Product }>();

// @todo Get this from API
const autoSurveyDetails: AutoSurveyDetails = {
  start: new Date().toISOString(),
  rate: 1,
  size: 1,
  maxSurveyCount: 1,
  coolOff: 1,
};
</script>

<template>
  <!-- @todo On click this will go the Survey Settings page which will be different depending on survey mode -->
  <router-link
    :to="{}"
    class="cursor-pointer rounded-lg bg-slate-50 p-4 shadow hover:border hover:border-slate-300 hover:bg-white hover:shadow-lg"
  >
    <p class="text-sm font-medium">
      Survey Mode Stats
      <span class="ml-1 font-light">(click for more)</span>
    </p>

    <p class="mb-2 border-b border-slate-300 pb-2 text-xl font-light">
      {{
        product.surveyMode === 1
          ? "Automatically Recurring"
          : "Passive / Manual"
      }}
      Mode
    </p>

    <div v-if="product.surveyMode === SurveyMode.manual" class="">
      <p>Click in to do a Manual Email Blast</p>

      <!-- Other manual email blast stats -->
    </div>

    <div v-else-if="product.surveyMode === SurveyMode.auto">
      <p>Click in to edit Automatic Surveying settings</p>

      <!-- Auto survey stats -->
      <div class="text-2xl font-extralight">
        <p>
          Rate: <b>{{ autoSurveyDetails.size }}%</b> of customers every
          <b>{{ autoSurveyDetails.rate }}</b> week(s)
        </p>
      </div>
    </div>
  </router-link>
</template>
