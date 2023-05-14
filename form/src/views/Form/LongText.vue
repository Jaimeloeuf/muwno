<script setup lang="ts">
import type { LongTextType } from "../../../../server/src/survey/SurveyValidator";

defineProps<{ ques: LongTextType }>();
</script>

<template>
  <FormKit
    type="textarea"
    :name="ques.ques"
    :label="ques.ques"
    :help="`Max ${ques.charLimit} characters`"
    placeholder=""
    :rows="3"
    outer-class="mb-5"
    label-class="block mb-1 font-bold text-sm"
    inner-class="max-w-md border border-gray-400 rounded-lg mb-1 overflow-hidden focus-within:border-blue-500"
    input-class="w-full px-3 border-none text-base text-gray-700 placeholder-gray-400"
    help-class="text-xs text-gray-500"
  />
</template>
