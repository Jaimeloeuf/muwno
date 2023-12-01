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
import type { ProductID } from "@domain-model";

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

const surveyLink = getSurveyLink(product.id);
const formFileName = ref("muwnoFeedback.ts");
const localStorageKey = ref("muwno-form-last-response");
const mainFile = computed(() =>
  generateMainFile(formFileName.value, surveyLink, surveyTimeInterval.value)
);
const formFile = computed(() => generateFormFile(localStorageKey.value));

// @todo Using simple hack to reset customisation options by reloading page
const resetOptions = () => window.location.reload();

const downloadMainFile = () => downloadFile("main.ts", mainFile.value);
const downloadFormFile = () => downloadFile(formFileName.value, formFile.value);
</script>

<template>
  <div>
    <TopNavbar back>Simple Feature Gating</TopNavbar>

    <div class="mx-auto w-full max-w-4xl font-light">
      <p class="pb-2 text-3xl">Simple feature gating</p>
      <p class="text-lg text-zinc-800">
        You can use <b>muwno</b> to do simple feature gating by ensuring that
        your customer completes the feedback form at a regular interval before
        they can use your product / feature.
      </p>

      <hr class="my-8" />

      <div>
        <div class="flex flex-row items-center justify-between pb-2">
          <p class="text-2xl">Options</p>
          <button
            class="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-1"
            @click="resetOptions"
          >
            Reset
          </button>
        </div>

        <div class="pb-3">
          <label>
            <p class="text-lg">
              How often do you want your customers to do your survey?
            </p>

            <div class="relative">
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
          </label>
        </div>

        <div class="pb-3">
          <label>
            <p class="text-lg">File Name</p>

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
            <p class="text-lg">localStorage key</p>
            <p>
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

      <hr class="my-12" />

      <p class="text-2xl">Generated Code</p>
      <p class="pb-8">Copy these into your application.</p>

      <div class="pb-8">
        <p><code>main.ts</code> (Your app's main entry point.)</p>

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
        <code>./{{ formFileName }}</code>

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
</template>
