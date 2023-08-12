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
    class="cursor-pointer rounded-lg bg-slate-50 p-4 text-left text-xl shadow hover:border hover:border-slate-300 hover:bg-white hover:shadow-lg"
    @click="downloadRawResponseCSV"
  >
    Download raw response data as CSV file.
  </button>
</template>
