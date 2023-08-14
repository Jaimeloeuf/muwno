<script setup lang="ts">
import { useRouter } from "vue-router";
import { useForm } from "./useForm";
import { FeedbackSubmittedRoute } from "../../router";

const props = defineProps<{ formID: string; defaultA1?: string }>();

const router = useRouter();

const { productName, radioOptions, a1, a2, a3, a4, submitForm } = await useForm(
  props.formID
);

// Use the default value for a1 after validating it
if (props.defaultA1 !== undefined) {
  const defaultA1 = parseInt(props.defaultA1);
  if (defaultA1 in [0, 1, 2]) a1.value = defaultA1;
}

async function submit() {
  // Input validation needs to be done before calling `submitForm` since it does
  // not do any input validation as there is no one to stop it from moving to
  // the next 'Thank you' page.
  if (a1.value === undefined)
    return alert("Please select an answer for Question 1!");

  // Not showing loader before submitting form and also not awaiting for this
  // because it doesnt really matter for the users submitting the form because
  // even if it failed it should just fail silently instead of messing with the
  // user's happy path and associating the product with errors.
  submitForm();

  router.push({ name: FeedbackSubmittedRoute.name });
}
</script>

<template>
  <!-- This ensures that the UI is always centered and limited to a width even in desktop mode -->
  <div class="m-6">
    <h1 class="mb-6 text-3xl font-extrabold tracking-tight text-gray-900">
      {{ productName }} feedback form
    </h1>

    <!-- Question 1 -->
    <div class="mb-6">
      <p class="mb-2">
        <span class="mr-1">Q1.</span> How would you feel if
        <span class="font-semibold">{{ productName }}</span>
        no longer exists? <span class="text-red-500">*</span>
      </p>

      <div
        v-for="option in radioOptions"
        :key="option.value"
        class="mb-3 flex rounded-lg border border-gray-200 p-4 py-3"
      >
        <label
          class="w-full cursor-pointer font-light"
          @click="a1 = option.value"
        >
          <input
            type="radio"
            name="bordered-radio"
            class="h-3 w-3 accent-lime-600"
            :checked="a1 === option.value"
          />

          <span class="ml-2 font-normal">{{ option.text }}</span> disappointed
        </label>
      </div>
    </div>

    <!-- Question 2 -->
    <div class="mb-6">
      <p class="mb-2">
        <span class="mr-1">Q2.</span> What type of people do you think would
        most benefit from <span class="font-semibold">{{ productName }}</span
        >?
      </p>

      <textarea
        v-model="a2"
        rows="2"
        class="block w-full resize-none rounded-lg border border-gray-300 p-3 font-light"
      >
      </textarea>
    </div>

    <!-- Question 3 -->
    <div class="mb-6">
      <p class="mb-2">
        <span class="mr-1">Q3.</span> What is the main benefit you receive from
        <span class="font-semibold">{{ productName }}</span
        >?
      </p>

      <textarea
        v-model="a3"
        rows="4"
        class="block w-full resize-none rounded-lg border border-gray-300 p-3 font-light"
      >
      </textarea>
    </div>

    <!-- Question 4 -->
    <div class="mb-6">
      <p class="mb-2">
        <span class="mr-1">Q4.</span> How can we improve
        <span class="font-semibold">{{ productName }}</span>
        for you?
      </p>

      <textarea
        v-model="a4"
        rows="4"
        class="block w-full resize-none rounded-lg border border-gray-300 p-3 font-light"
      >
      </textarea>
    </div>

    <button
      class="w-full rounded bg-lime-500 py-2 font-bold text-white"
      @click="submit"
    >
      Submit
    </button>

    <div class="mt-6 text-center">
      <a
        href="https://thepmftool.com"
        target="_blank"
        class="text-xs text-gray-500 underline"
      >
        &copy;2023 - {{ new Date().getFullYear() }} thepmftool. All rights
        reserved.
      </a>
    </div>

    <div class="mt-6 text-center text-xs font-extralight">
      This site is protected by reCAPTCHA and the Google
      <a
        target="_blank"
        class="text-blue-800"
        href="https://policies.google.com/privacy"
      >
        Privacy Policy
      </a>
      and
      <a
        target="_blank"
        class="text-blue-800"
        href="https://policies.google.com/terms"
      >
        Terms of Service
      </a>
      apply.
    </div>
  </div>
</template>
