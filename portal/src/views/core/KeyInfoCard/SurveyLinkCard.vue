<script setup lang="ts">
import { ref } from "vue";
import QRCode, { type QRCodeToDataURLOptions } from "qrcode";
import type { Product } from "domain-model";
import CopyOnClick from "../../components/CopyOnClick.vue";

const props = defineProps<{ product: Product }>();

const surveyLink = `https://form.theprodtool.com/#/feedback/${props.product.id}`;

const imageDataUrl = ref<string>("");

async function generateQR() {
  imageDataUrl.value = await QRCode.toDataURL(surveyLink, {
    errorCorrectionLevel: "H",
    width: 1024,
    height: 1024,
  } as QRCodeToDataURLOptions);
}
</script>

<template>
  <div class="w-full rounded-lg bg-slate-50 p-4 shadow">
    <div
      class="mb-2 flex flex-row items-center justify-between border-b border-slate-300 pb-2"
    >
      <p class="text-lg font-medium">Survey Link</p>

      <button
        v-if="imageDataUrl === ''"
        class="rounded-lg bg-slate-400 px-3 text-center text-white shadow-lg"
        @click="generateQR()"
      >
        Show QR Code
      </button>
      <button
        v-else
        class="rounded-lg bg-slate-400 px-3 text-center text-white shadow-lg"
        @click="imageDataUrl = ''"
      >
        Hide QR Code
      </button>
    </div>

    <div class="text-right">
      <CopyOnClick>
        <p class="break-words text-sm font-extralight">
          {{ surveyLink }}
        </p>
        <p class="font-normal">Click to copy link</p>
      </CopyOnClick>
    </div>

    <div v-if="imageDataUrl !== ''" class="mt-4">
      <img class="mb-4" :src="imageDataUrl" />

      <div class="flex flex-row space-x-6">
        <a
          target="_blank"
          :href="imageDataUrl"
          :download="`Survey QR Code for ${product.name}`"
          class="w-full rounded-lg bg-yellow-500 px-3 py-1 text-center text-white shadow-lg"
        >
          Download
        </a>

        <button
          class="w-full rounded-lg bg-slate-400 px-3 py-1 text-center text-white shadow-lg"
          @click="imageDataUrl = ''"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
