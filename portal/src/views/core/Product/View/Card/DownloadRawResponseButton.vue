<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { useLoader } from "../../../../../store";
import { getAuthHeader } from "../../../../../firebase";
import { downloadFile } from "../../../../../utils/downloadFile";
import type { Product } from "@domain-model";

const props = defineProps<{ product: Product }>();

const loader = useLoader();

const showHelp = ref(false);

async function downloadRawResponseCSV() {
  loader.show("Loading response data to download ...");

  const { res, err } = await sf
    .useDefault()
    // @todo Use URL query params to specify what to download, i.e. date range, number of records etc etc...
    .GET(`/feedback/response/download/${props.product.id}`)
    .useHeader(getAuthHeader)
    .runText();

  if (err) throw err;
  if (!res.ok) throw new Error(`Fail to download ${JSON.stringify(res)}`);

  loader.hide();

  downloadFile(
    // urlencode name to ensure it can be saved even with special characters
    `Raw Survey Response data for ${encodeURIComponent(
      props.product.name
    )}.csv`,
    res.data
  );
}
</script>

<template>
  <div class="rounded-lg border border-zinc-200 p-4 text-left">
    <div class="mb-2 flex flex-row items-center justify-between gap-6">
      <p>Raw response data as CSV file</p>

      <button
        class="rounded-lg bg-zinc-100 px-3 font-light text-zinc-900"
        @click="showHelp = !showHelp"
      >
        Help
      </button>
    </div>

    <p v-if="showHelp" class="mb-4 border-t border-zinc-200 pt-2 font-light">
      Download up to 1000 rows of your raw survey response data sorted by newest
      first. If you need more or all historical data, reach out to us at
      <a class="underline" href="mailto:help@thepmftool.com">
        help@thepmftool.com
      </a>
      to generate it for you.
    </p>

    <button
      class="flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-2"
      @click="downloadRawResponseCSV"
    >
      Download

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
  </div>
</template>
