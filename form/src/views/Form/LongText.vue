<script setup lang="ts">
import type { LongTextType } from "../../../../server/src/survey/SurveyValidator";

defineProps<{ ques: LongTextType; name: string }>();
</script>

<template>
  <FormKit
    type="textarea"
    :name="name"
    :label="ques.ques"
    :help="`Max ${ques.charLimit} characters`"
    placeholder=""
    :rows="3"
    outer-class="mb-5"
    label-class="block mb-1 font-bold text-sm"
    inner-class="border border-zinc-300 rounded-lg mb-1 overflow-hidden"
    input-class="w-full px-3 border-none text-base text-zinc-700 placeholder-zinc-400"
    help-class="text-xs text-zinc-500"
  />
</template>
