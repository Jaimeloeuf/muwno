<script setup lang="ts">
import type { OptionType } from "../../../../server/src/survey/SurveyValidator";

const props = defineProps<{ ques: OptionType }>();
const options = props.ques.options.map((option, index) => ({
  label: option,
  value: index,
}));
</script>

<template>
  <!-- v-model="value" -->
  <FormKit
    type="radio"
    :label="ques.ques"
    :options="options"
    outer-class="mb-6"
    legend-class="font-bold"
    inner-class="inline-block pr-2 my-1"
  />
</template>
