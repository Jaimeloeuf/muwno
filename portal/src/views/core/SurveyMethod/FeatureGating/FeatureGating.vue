<script setup lang="ts">
import "highlight.js/styles/stackoverflow-light.css";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import hljsVuePlugin from "@highlightjs/vue-plugin";

import { ref, computed } from "vue";
import { generateMainFile, generateFormFile } from "./sampleCode";
import { useProduct } from "../../../../store";
import TopNavbar from "../../../shared/TopNavbar.vue";
import CopyOnClick from "../../../shared/CopyOnClick.vue";
import { downloadFile } from "../../../../utils/downloadFile";
import { getSurveyLink } from "../../../../utils/getSurveyLink";
import { isLinkValidReactive } from "../../../../utils/isLinkValid";
import type { ProductID } from "@domain-model";
import { FormRedirectQueryParam } from "@domain-model";

// Hardcoding to TS since code generation only supports TS/JS, and HLJS's TS
// theme can highlight both as the JS is just TS with implicitly inferred types.
hljs.registerLanguage("typescript", typescript);
const highlightjs = hljsVuePlugin.component;

const props = defineProps<{ productID: ProductID }>();

const productStore = useProduct();
const product = await productStore.getProduct(props.productID);

enum IntervalType {
  day = "day",
  week = "week",
  month = "month",
}
const intervalTypeToMillisecondsMap = {
  [IntervalType.day]: 8.64e7,
  [IntervalType.week]: 6.048e8,
  [IntervalType.month]: 2.628e9,
};

const intervals = ref<number>(1);
const selectedIntervalType = ref<IntervalType>(IntervalType.week);
const surveyTimeInterval = computed(
  () =>
    intervals.value * intervalTypeToMillisecondsMap[selectedIntervalType.value]
);

const redirectLink = ref("");
const isRedirectLinkValid = isLinkValidReactive(redirectLink);

// Only include the redirect link if it is valid
const surveyLink = computed(() =>
  isRedirectLinkValid.value
    ? `${getSurveyLink(product.id)}?redirect=${encodeURIComponent(
        redirectLink.value
      )}`
    : getSurveyLink(product.id)
);

const alertUser = ref(true);
const alertMessage = ref(
  "Please complete a feedback form before you can continue using the Feature."
);

const selectedLanguage = ref<"TypeScript" | "JavaScript">("TypeScript");
const languageFileExtension: Record<
  (typeof selectedLanguage)["value"],
  string
> = {
  TypeScript: ".ts",
  JavaScript: ".js",
};

const mainFileName = computed(
  () => `main${languageFileExtension[selectedLanguage.value]}`
);
const formFileName = ref("muwnoFeedback");
const fullFormFileName = computed(
  () => `${formFileName.value}${languageFileExtension[selectedLanguage.value]}`
);

const localStorageKey = ref("muwno-form-last-response");
const mainFile = computed(() =>
  generateMainFile(
    fullFormFileName.value,
    surveyLink.value,
    surveyTimeInterval.value
  )
);
const formFile = computed(() =>
  generateFormFile(
    selectedLanguage.value === "TypeScript",
    localStorageKey.value,
    alertUser.value,
    alertMessage.value
  )
);

// @todo Using simple hack to reset customisation options by reloading page
const resetOptions = () => window.location.reload();

const downloadMainFile = () => downloadFile(mainFileName.value, mainFile.value);
const downloadFormFile = () =>
  downloadFile(fullFormFileName.value, formFile.value);
</script>

<template>
  <div>
    <TopNavbar back>Feature Gating</TopNavbar>

    <div class="flex flex-col justify-between gap-8 xl:flex-row xl:pt-4">
      <div class="mx-auto w-full max-w-3xl font-light xl:max-w-xl">
        <p class="pb-2 text-3xl">Simple feature gating</p>
        <p class="pb-4 text-lg text-zinc-800">
          You can use <b>muwno</b> to do simple product / feature gating by
          ensuring that your customer completes the feedback form at a regular
          intervals before they can use your product / feature.
        </p>

        <p class="text-lg text-zinc-800">UX Flow</p>
        <ol class="list-decimal px-5 pb-2 text-lg">
          <li>
            Check for time of last survey response locally cached in
            localStorage.
          </li>
          <li>
            If there is no last response time cached locally, i.e. the user's
            first time using the app, cache the current time as the 'last
            response time', so that the first time you survey your users is
            after they have used your app for at least a period of time longer
            than what is set as the survey interval time period.
          </li>
          <li>
            If time of last survey response is older than the survey interval
            being set (e.g. once a week), redirect to the feedback form for user
            to submit their feedback.
          </li>
          <li>
            Once user submits their feedback, they will be redirected back to
            the URL configured below with the success indicator
            <code class="italic">{{ FormRedirectQueryParam }}=true</code> in the
            URL query params.
          </li>
        </ol>

        <hr class="my-8" />

        <div class="flex flex-row items-center justify-between pb-4">
          <p class="text-2xl">Options</p>
          <button
            class="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-1"
            @click="resetOptions"
          >
            Reset
          </button>
        </div>

        <div class="flex flex-col gap-6">
          <div>
            <p class="text-lg font-normal">Your application's language</p>
            <p class="pb-2">
              Only supports TS/JS for now, If you would like us to support other
              languages, email
              <a
                href="mailto:help@muwno.com"
                class="italic underline decoration-zinc-400"
                >help@muwno.com</a
              >
            </p>

            <select
              v-model="selectedLanguage"
              class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 focus:outline-none"
            >
              <option
                v-for="language in (['TypeScript', 'JavaScript'] as const)"
                :key="language"
                :value="language"
                :selected="language === selectedLanguage"
              >
                {{ language }}
                <template v-if="language === 'TypeScript'">
                  (recommended)
                </template>
              </option>
            </select>
          </div>

          <div>
            <label>
              <p class="text-lg font-normal">
                Redirect Link <span class="text-red-600">*</span>
              </p>
              <ol class="list-decimal px-5 pb-2">
                <li>
                  Once the feedback form is completed, users will be redirected
                  back to this link with the success indicator
                  <code class="italic">{{ FormRedirectQueryParam }}=true</code>
                  in the URL query params.
                </li>
                <li>Write full URL including the <code>https</code> scheme</li>
              </ol>

              <input
                v-model.trim="redirectLink"
                type="text"
                class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
                :class="{
                  'bg-red-100': redirectLink !== '' && !isRedirectLinkValid,
                }"
                placeholder="Redirect here"
              />
            </label>
          </div>

          <div>
            <label>
              <p class="text-lg font-normal">Survey Interval</p>
              <p>How often do you want to survey your customers?</p>

              <div class="flex flex-row items-center gap-2">
                <p class="text-xl font-extralight">Every</p>
                <div class="relative w-full">
                  <input
                    v-model="intervals"
                    type="number"
                    class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
                    min="1"
                  />

                  <select
                    v-model="selectedIntervalType"
                    class="absolute inset-y-0 right-0 rounded-r-lg border border-l-zinc-100 bg-zinc-100 px-8 focus:outline-none"
                  >
                    <option
                      v-for="intervalType in IntervalType"
                      :key="intervalType"
                      :value="intervalType"
                      :selected="intervalType === selectedIntervalType"
                    >
                      {{ intervalType }}
                    </option>
                  </select>
                </div>
              </div>
            </label>
          </div>

          <div>
            <p class="text-lg font-normal">Alert user before redirect?</p>
            <p>
              Users will see an alert popup notifying them that they will be
              redirected to complete a feedback form before they can continue
              using your application or the selected feature.
            </p>

            <div class="flex flex-row items-center justify-between gap-4 pt-2">
              <button
                class="w-full rounded-lg border p-1"
                :class="{ 'bg-zinc-200': alertUser }"
                @click="alertUser = !alertUser"
              >
                show
              </button>
              <button
                class="w-full rounded-lg border p-1"
                :class="{ 'bg-zinc-200': !alertUser }"
                @click="alertUser = !alertUser"
              >
                hide
              </button>
            </div>

            <div v-if="alertUser" class="pt-2">
              <p>Alert message</p>
              <textarea
                v-model.trim="alertMessage"
                class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
                rows="2"
                placeholder="Message to show in the alert popup..."
              ></textarea>
            </div>
          </div>

          <div>
            <label>
              <p class="text-lg font-normal">File Name</p>

              <input
                v-model.trim="formFileName"
                type="text"
                class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
                placeholder="File Name"
              />
            </label>
          </div>

          <div>
            <label>
              <p class="text-lg font-normal">localStorage key</p>
              <p class="pb-2">
                Do not change this unless absolutely necessary. Ensure that this
                key will not clash with any existing or future
                <span class="rounded-lg bg-zinc-100 px-2">localStorage</span>
                keys.
              </p>

              <input
                v-model.trim="localStorageKey"
                type="text"
                class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
                placeholder="muwno-form-last-response"
              />
            </label>
          </div>
        </div>
      </div>

      <div class="mx-auto w-full max-w-4xl font-light">
        <p class="text-2xl">Generated Code</p>
        <p class="pb-4">
          Copy these into your application. If you need help, email
          <a
            href="mailto:help@muwno.com"
            class="italic underline decoration-zinc-400"
            >help@muwno.com</a
          >
        </p>

        <div class="pb-8">
          <p>
            <code>{{ mainFileName }}</code>
            (Your app's main entry point.)
          </p>

          <div class="relative">
            <div class="absolute right-2 top-2 flex flex-row gap-2">
              <CopyOnClick
                :textToCopy="mainFile"
                class="rounded-lg border border-zinc-400 bg-white px-2 py-1 shadow-xl"
              >
                Copy
              </CopyOnClick>

              <button
                class="rounded-lg border border-zinc-400 bg-white px-2 py-1 shadow-xl"
                @click="downloadMainFile"
              >
                Download
              </button>
            </div>

            <highlightjs language="typescript" :code="mainFile" />
          </div>
        </div>

        <div>
          <code>./{{ fullFormFileName }}</code>

          <div class="relative">
            <div class="absolute right-2 top-2 flex flex-row gap-2">
              <CopyOnClick
                :textToCopy="formFile"
                class="rounded-lg border border-zinc-400 bg-white px-2 py-1 shadow-xl"
              >
                Copy
              </CopyOnClick>

              <button
                class="rounded-lg border border-zinc-400 bg-white px-2 py-1 shadow-xl"
                @click="downloadFormFile"
              >
                Download
              </button>
            </div>

            <highlightjs language="typescript" :code="formFile" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
