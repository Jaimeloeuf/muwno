<script setup lang="ts">
import { survey } from "./SampleSurvey";

import LongText from "./LongText.vue";
import Option from "./Option.vue";

const props = defineProps<{ formID: string }>();
console.log(props.formID);
</script>

<template>
  <div class="m-6 grid max-w-md">
    <form>
      <h1
        class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
      >
        {{ survey.title }}
      </h1>

      <div v-for="(ques, i) in survey.ques" :key="i">
        <template v-if="ques.type === 'long-text'">
          <LongText :ques="ques" />
        </template>

        <template v-else-if="ques.type === 'option'">
          <Option :ques="ques" />
        </template>
      </div>

      <button
        class="w-full rounded bg-green-500 px-4 py-2 font-bold text-white"
      >
        Submit
      </button>
    </form>

    <p class="mt-6 text-center text-xs text-gray-500">
      &copy;2023 StarterKit. All rights reserved.
    </p>
  </div>
</template>
