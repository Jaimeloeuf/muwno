<script setup lang="ts">
import { useForm } from "./useForm";

import LongText from "./LongText.vue";
import Option from "./Option.vue";

const props = defineProps<{ formID: string }>();

const { form, submitForm } = await useForm(props.formID);
</script>

<template>
  <div class="m-6">
    <FormKit type="form" :actions="false" @submit="submitForm">
      <h1
        class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
      >
        {{ form.title }}
      </h1>

      <!-- Loop through questions and render each question based on its type -->
      <!-- Generate a unique name for each question with its question index to read the answers later -->
      <div v-for="(ques, i) in form.ques" :key="i">
        <!-- @todo -->
        <!-- UI should render the optional/not optional thing -->
        <!-- For text questions, if NOT OPTIONAL, must make sure that an empty string is converted to undefined for checking -->

        <template v-if="ques.type === 'long-text'">
          <LongText :name="`_q${i}`" :ques="ques" />
        </template>

        <template v-else-if="ques.type === 'option'">
          <Option :name="`_q${i}`" :ques="ques" />
        </template>
      </div>

      <FormKit
        type="submit"
        input-class="w-full rounded bg-green-500 px-4 py-2 font-bold text-white"
      />
    </FormKit>

    <p class="mt-6 text-center text-xs text-gray-500">
      &copy;2023 StarterKit. All rights reserved.
    </p>
  </div>
</template>
