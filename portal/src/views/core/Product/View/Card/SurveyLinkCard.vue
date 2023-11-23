<script setup lang="ts">
import { ref } from "vue";
import QRCode, { type QRCodeToDataURLOptions } from "qrcode";
import type { Product } from "@domain-model";
import CopyOnClick from "../../../../shared/CopyOnClick.vue";
import { formLink } from "../../../../../utils/links";

const props = defineProps<{ product: Product }>();

const surveyLink = `${formLink}/#/pmf/${props.product.id}`;

const showModal = ref<boolean>(false);
const imageDataUrl = ref<string | null>(null);

async function generateQrCodeAndShowModal() {
  showModal.value = true;
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
    class="fixed inset-0 z-30 flex flex-col items-center justify-center bg-white py-12"
    @click="showModal = false"
  >
    <div
      v-if="imageDataUrl !== null"
      class="flex flex-col font-light lg:flex-row lg:gap-6"
      @click.stop
    >
      <div class="flex flex-col gap-8">
        <div class="flex flex-row justify-between">
          <p class="text-2xl">Survey Link & QR Code</p>

          <button
            class="rounded-lg border border-zinc-200 bg-zinc-100 px-6 font-normal text-zinc-800"
            @click="showModal = false"
          >
            Close
          </button>
        </div>

        <CopyOnClick :textToCopy="surveyLink">
          <div class="w-full rounded-lg border border-zinc-200 p-4">
            {{ surveyLink }}
            <p class="font-medium">Click to copy link</p>
          </div>
        </CopyOnClick>

        <a
          target="_blank"
          :href="imageDataUrl"
          :download="`Survey QR Code for ${product.name}`"
        >
          <p
            class="w-full rounded-lg border border-green-600 p-3 text-center text-green-600"
          >
            Download QR Code
          </p>
        </a>
      </div>

      <img class="max-w-[15rem]" :src="imageDataUrl" />
    </div>
    <p v-else class="text-xl font-medium">... Generating QR Code ...</p>
  </div>

  <button
    class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-1 text-left"
    @click="generateQrCodeAndShowModal"
  >
    <div class="flex flex-row items-center justify-between">
      <p>Show Survey Link & QR Code</p>
    </div>
  </button>
</template>
