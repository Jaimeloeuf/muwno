<script setup lang="ts">
import "highlight.js/styles/stackoverflow-light.css";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import hljsVuePlugin from "@highlightjs/vue-plugin";

import { ref, computed } from "vue";
import { generateSampleCode } from "./sampleCode";
import { useProduct } from "../../../../store";
import TopNavbar from "../../../shared/TopNavbar.vue";
import CopyOnClick from "../../../shared/CopyOnClick.vue";
import { downloadFile } from "../../../../utils/downloadFile";
import type { ProductID } from "@domain-model";

hljs.registerLanguage("typescript", typescript);
const highlightjs = hljsVuePlugin.component;

const props = defineProps<{ productID: ProductID }>();

const productStore = useProduct();

const product = await productStore.getProduct(props.productID);

const fileName = ref("muwnoFeedback.ts");
const sampleCode = computed(() => generateSampleCode(fileName.value));

// @todo Using simple hack to reset customisation options by reloading page
const resetOptions = () => window.location.reload();

const downloadSampleCode = () => downloadFile(fileName.value, sampleCode.value);
</script>

<template>
  <div>
    <TopNavbar back>Simple Feature Gating</TopNavbar>

    <div class="mx-auto w-full max-w-4xl">
      <p class="pb-2 text-2xl">Simple feature gating</p>
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
          <p>File Name</p>

          <input
            v-model.trim="fileName"
            type="text"
            class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
            placeholder="File Name"
          />
        </label>
      </div>

      <hr class="my-12" />

      <div class="flex flex-row items-center justify-between pb-4">
        <p class="text-2xl font-thin">Generated Code</p>
        <button
          class="rounded-lg border border-zinc-200 bg-zinc-50 p-2"
          @click="downloadSampleCode"
        >
          Download source code
        </button>
      </div>

      <div class="relative">
        <CopyOnClick
          :textToCopy="sampleCode"
          class="absolute right-2 top-2 rounded-lg border border-zinc-400 bg-white px-4 py-1 shadow-xl"
        >
          copy
        </CopyOnClick>
        <highlightjs language="typescript" :code="sampleCode" />
      </div>
    </div>
  </div>
</template>
