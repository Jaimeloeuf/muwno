<script setup lang="ts">
import { useRouter } from "vue-router";
import { PmfSurveySubmittedRoute } from "../../../router";
import { usePmfSurvey } from "../../../composable";
import { landingLink } from "../../../utils/links";
import GrowableTextarea from "../../shared/GrowableTextarea.vue";

const props = defineProps<{
  formID: string;
  redirect?: string;
  defaultA1?: string;
}>();

const router = useRouter();

const {
  productName,
  defaultRedirectLink,
  radioOptions,
  a1,
  a2,
  a3,
  a4,
  submitForm,
} = await usePmfSurvey(props.formID);

// Use the default value for a1 after validating it
if (props.defaultA1 !== undefined) {
  const defaultA1 = parseInt(props.defaultA1);
  if (defaultA1 in [1, 2, 3]) a1.value = defaultA1;
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

  router.push({
    name: PmfSurveySubmittedRoute.name,
    query: { redirect: props.redirect ?? defaultRedirectLink },
  });
}
</script>

<template>
  <div class="m-6">
    <h1
      class="pb-6 text-3xl font-extrabold tracking-tight text-zinc-900 sm:pt-6"
    >
      {{ productName }} feedback form
    </h1>

    <div class="mb-6">
      <p class="mb-2">
        <span class="mr-1">Q1.</span> How would you feel if
        <span class="font-semibold">{{ productName }}</span>
        no longer exists?
        <span class="text-lg font-medium text-red-500">*</span>
      </p>

      <div v-for="option in radioOptions" :key="option.value" class="pb-3">
        <label
          class="w-full cursor-pointer select-none font-light"
          @click="a1 = option.value"
        >
          <div class="rounded-lg border border-zinc-200 p-4 py-3">
            <input
              type="radio"
              name="bordered-radio"
              class="h-3 w-3 accent-lime-600"
              :checked="a1 === option.value"
            />

            <span class="ml-2 font-normal">{{ option.text }}</span> disappointed
          </div>
        </label>
      </div>
    </div>

    <div class="mb-6">
      <p class="mb-2">
        <span class="mr-1">Q2.</span> What type of people do you think would
        most benefit from <span class="font-semibold">{{ productName }}</span
        >?
      </p>

      <input
        v-model.trim="a2"
        class="w-full resize-none rounded-lg border border-zinc-200 p-3 font-light focus:outline-none"
      />
    </div>

    <div class="mb-6">
      <p class="mb-2">
        <span class="mr-1">Q3.</span> What is the main benefit you receive from
        <span class="font-semibold">{{ productName }}</span
        >?
      </p>

      <GrowableTextarea
        v-model.trim="a3"
        rows="2"
        placeholder="Main benefit"
        class="w-full resize-none rounded-lg border border-zinc-200 p-3 font-light focus:outline-none"
      />
    </div>

    <div class="mb-6">
      <p class="mb-2">
        <span class="mr-1">Q4.</span> How can we improve
        <span class="font-semibold">{{ productName }}</span>
        for you?
      </p>

      <GrowableTextarea
        v-model.trim="a4"
        rows="3"
        placeholder="Suggestions..."
        class="w-full resize-none rounded-lg border border-zinc-200 p-3 font-light focus:outline-none"
      />
    </div>

    <button
      class="w-full rounded-lg border border-green-600 py-2 text-xl text-green-600"
      @click="submit"
    >
      Submit
    </button>

    <div class="pt-12 text-xs">
      <a
        :href="landingLink"
        target="_blank"
        class="font-extralight underline decoration-zinc-300 decoration-0 underline-offset-2"
      >
        All rights reserved. &copy; muwno since 2023
      </a>

      <p class="pt-1 font-thin">
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
      </p>
    </div>
  </div>
</template>
