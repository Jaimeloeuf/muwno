<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { downloadFile } from "../../../utils/downloadFile";
import type { Product } from "@domain-model";

const props = defineProps<{ product: Product }>();

async function downloadRawResponseCSV() {
  const { res, err } = await sf
    .useDefault()
    // @todo Use URL query params to specify what to download, i.e. date range, number of records etc etc...
    .GET(`/feedback/response/download/${props.product.id}`)
    .useHeader(getAuthHeader)
    .runText();

  if (err) throw err;
  if (!res.ok) throw new Error(`Fail to download ${JSON.stringify(res)}`);

  downloadFile(
    // @todo urlencode name to ensure it can be saved by removing special characters
    `Raw Survey Response data for ${props.product.name}.csv`,
    res.data
  );
}
</script>

<template>
  <button
    class="flex cursor-pointer flex-row items-center justify-between rounded-lg bg-slate-50 p-4 text-left shadow hover:border hover:border-slate-300 hover:bg-white hover:shadow-lg"
    @click="downloadRawResponseCSV"
  >
    Download raw response data as CSV file

    <svg
      class="h-3 w-3 shrink-0 rotate-90 transition duration-150"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 6"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5 5 1 1 5"
      />
    </svg>
  </button>
</template>
