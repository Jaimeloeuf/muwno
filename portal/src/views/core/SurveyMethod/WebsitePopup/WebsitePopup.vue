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

const surveyLink = getSurveyLink(props.productID);
const surveyTimeInterval = ref(6.048e8);
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
      <p class="pb-4 text-lg text-zinc-800">
        You can use <b>muwno</b> to do simple feature gating by ensuring that
        your customer completes the feedback form at a regular interval before
        they can use your product / feature.
      </p>

      <div class="font-light">
        <div class="flex flex-row items-center justify-between">
          <p class="text-xl">Options</p>
          <button
            class="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-1"
            @click="resetOptions"
          >
            Reset
          </button>
        </div>

        <div class="pb-4">
          <label>
            <p class="text-lg">Survey time interval in milliseconds</p>
            <p>How often do you want your customers to do your survey?</p>

            <input
              v-model="surveyTimeInterval"
              type="number"
              class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
              placeholder="Time in milliseconds"
            />
          </label>
        </div>

        <div class="pb-4">
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

      <p class="text-2xl font-thin">Generated Code</p>
      <p class="pb-8 font-extralight">Copy these into your application.</p>

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
