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
const mainFileName = ref("muwnoFeedback.ts");
const mainFile = computed(() =>
  generateMainFile(mainFileName.value, surveyLink)
);
const formFile = computed(() => generateFormFile());

// @todo Using simple hack to reset customisation options by reloading page
const resetOptions = () => window.location.reload();

const downloadMainFile = () => downloadFile("main.ts", mainFile.value);
const downloadFormFile = () => downloadFile(mainFileName.value, formFile.value);
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

        <label>
          <p class="text-lg">File Name</p>

          <input
            v-model.trim="mainFileName"
            type="text"
            class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
            placeholder="File Name"
          />
        </label>
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
        <code>./{{ mainFileName }}</code>

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
