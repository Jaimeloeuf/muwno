<script setup lang="ts">
import { ref } from "vue";
import QRCode, { type QRCodeToDataURLOptions } from "qrcode";
import type { Product } from "@domain-model";
import CopyOnClick from "../../../../components/CopyOnClick.vue";
import { formLink } from "../../../../../utils/links";

const props = defineProps<{ product: Product }>();

const surveyLink = `${formLink}/#/feedback/${props.product.id}`;

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
  <div class="w-full rounded-lg border border-zinc-200 p-4">
    <div
      class="mb-2 flex flex-row items-center justify-between border-b border-zinc-200 pb-2"
    >
      <p>Survey Link</p>

      <button
        v-if="imageDataUrl === ''"
        class="rounded-lg bg-zinc-100 px-3 text-center font-light"
        @click="generateQR()"
      >
        Show QR Code
      </button>
      <button
        v-else
        class="rounded-lg bg-zinc-100 px-3 text-center font-light"
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
      <img :src="imageDataUrl" />

      <div class="flex flex-row gap-6">
        <button
          class="w-full rounded-lg border border-zinc-200 py-1 text-center font-light text-zinc-900"
          @click="imageDataUrl = ''"
        >
          Close
        </button>

        <a
          target="_blank"
          :href="imageDataUrl"
          :download="`Survey QR Code for ${product.name}`"
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-1 text-center"
        >
          Download
        </a>
      </div>
    </div>
  </div>
</template>
