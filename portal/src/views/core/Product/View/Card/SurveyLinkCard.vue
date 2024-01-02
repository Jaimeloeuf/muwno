<script setup lang="ts">
import { ref } from "vue";
import QRCode, { type QRCodeToDataURLOptions } from "qrcode";
import type { Product } from "@domain-model";
import CopyOnClick from "../../../../shared/CopyOnClick.vue";
import { getSurveyLink } from "../../../../../utils/getSurveyLink";

const props = defineProps<{ product: Product }>();

const surveyLink = getSurveyLink(props.product.id);
const showModal = ref<boolean>(false);
const imageDataUrl = ref<string | null>(null);

async function generateQrCodeAndShowModal() {
  showModal.value = true;

  // Only generate once
  if (imageDataUrl.value === null)
    imageDataUrl.value = await QRCode.toDataURL(surveyLink, {
      errorCorrectionLevel: "H",
      width: 1024,
      height: 1024,
    } as QRCodeToDataURLOptions);
}
</script>

<template>
  <div
    v-if="showModal"
    class="fixed left-0 top-0 z-30 h-screen w-screen bg-black bg-opacity-70 p-8 md:flex md:flex-col md:items-center md:justify-center"
    @click="showModal = false"
  >
    <div
      v-if="imageDataUrl !== null"
      class="flex flex-col rounded-lg bg-white p-3 font-light lg:flex-row lg:gap-6 lg:p-6"
      @click.stop
    >
      <div class="py-6">
        <div class="flex flex-row justify-between pb-4">
          <p class="text-2xl">Survey Link & QR Code</p>

          <button
            class="rounded-lg border border-zinc-200 bg-zinc-50 px-6 text-zinc-800"
            @click="showModal = false"
          >
            Close
          </button>
        </div>

        <div class="pb-4">
          <CopyOnClick :textToCopy="surveyLink">
            <div class="w-full break-all rounded-lg border border-zinc-200 p-3">
              {{ surveyLink }}
              <p class="text-right font-medium">Click to copy link</p>
            </div>
          </CopyOnClick>
        </div>

        <a
          target="_blank"
          :href="imageDataUrl"
          :download="`Survey QR Code for ${product.name}`"
        >
          <p
            class="w-full rounded-lg border border-green-600 p-2 text-center text-green-600"
          >
            Download QR Code
          </p>
        </a>
      </div>

      <img class="w-96 lg:w-60" :src="imageDataUrl" />
    </div>

    <p v-else class="rounded-lg bg-white p-6 text-xl font-medium">
      ... Generating QR Code ...
    </p>
  </div>

  <button
    class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-1 text-left"
    @click="generateQrCodeAndShowModal"
  >
    <div class="flex flex-row items-center">
      <!-- @todo Only show this if user just created the product -->
      <span v-if="false" class="pr-3">
        <span class="relative flex h-3 w-3">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-900 opacity-80"
          ></span>
          <span
            class="relative inline-flex h-3 w-3 rounded-full bg-zinc-400"
          ></span>
        </span>
      </span>
      <p>Show Survey Link & QR Code</p>
    </div>
  </button>
</template>
