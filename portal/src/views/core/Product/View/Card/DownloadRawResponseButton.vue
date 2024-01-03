<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { useLoader, useError } from "../../../../../store";
import { getAuthHeader } from "../../../../../firebase";
import { prettyJSON, downloadFile } from "../../../../../utils";
import type { Product } from "@domain-model";

const props = defineProps<{ product: Product }>();

const loader = useLoader();
const errorStore = useError();

const showHelp = ref(false);

async function downloadRawResponseCSV() {
  loader.show("Loading response data to download ...");

  const { res, err } = await sf
    .useDefault()
    // @todo Use URL query params to specify what to download, i.e. date range, number of records etc etc...
    .GET(`/feedback/response/download/${props.product.id}`)
    .useHeader(getAuthHeader)
    .runText();

  loader.hide();

  if (err) {
    errorStore.newError(err);
    return;
  }
  if (!res.ok) {
    errorStore.newError(new Error(`Download failed ${prettyJSON(res)}`));
    return;
  }

  downloadFile(
    // @todo Check if urlencoding needed to save even with special characters
    // `Raw Survey Response data for ${encodeURIComponent(
    //   props.product.name
    // )}.csv`,
    `Raw Survey Response data for ${props.product.name}.csv`,
    res.data
  );
}
</script>

<template>
  <div class="rounded-lg border border-zinc-200 p-4 text-left">
    <div class="mb-4 flex flex-row items-center justify-between gap-6">
      <p>Survey Responses</p>

      <button
        class="rounded-lg border border-zinc-200 bg-zinc-50 px-3 font-light text-zinc-900"
        @click="showHelp = !showHelp"
      >
        Help
      </button>
    </div>

    <p v-if="showHelp" class="mb-4 border-t border-zinc-200 pt-2 font-light">
      Download up to 1000 rows of your raw survey response data in CSV file
      format sorted by newest first. If you need more or all historical data,
      reach out to us at
      <a class="underline" href="mailto:help@muwno.com">help@muwno.com</a>
      to generate it for you.
    </p>

    <button
      class="flex w-full flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-2"
      @click="downloadRawResponseCSV"
    >
      Download

      <svg
        class="mr-4 h-4 w-4 shrink-0"
        viewBox="0 0 612 612"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M332.883 379.54V27.6829C332.883 20.5666 330.124 13.7372 325.039 8.64469C319.953 3.70668 313.124 0.799805 306 0.799805C298.877 0.799805 292.047 3.70668 286.962 8.64469C281.877 13.7372 279.117 20.5666 279.117 27.6829V379.54C279.117 379.54 227.809 328.239 199.182 299.605C194.097 294.519 187.26 291.76 180.144 291.76C173.02 291.76 166.191 294.519 161.105 299.605C150.641 310.069 150.641 327.076 161.105 337.534L287.978 464.414C292.776 469.212 299.171 471.824 306 471.824C312.83 471.824 319.225 469.212 324.023 464.414L450.895 337.534C461.36 327.076 461.36 310.069 450.895 299.605C445.81 294.519 438.981 291.76 431.857 291.76C424.741 291.76 417.904 294.519 412.819 299.605C384.044 328.239 332.883 379.54 332.883 379.54Z"
          fill="black"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.799805 560.333C0.799805 573.852 6.17937 586.782 15.7684 596.231C25.3648 605.82 38.2948 611.2 51.6665 611.2H560.333C573.852 611.2 586.782 605.82 596.231 596.231C605.82 586.635 611.2 573.705 611.2 560.333V406.423C611.2 391.602 599.138 379.54 584.317 379.54C577.193 379.54 570.364 382.447 565.271 387.385C560.186 392.47 557.426 399.307 557.426 406.423V532.14C557.426 546.233 546.093 557.573 531.993 557.573H80.0067C65.9065 557.573 54.5734 546.233 54.5734 532.14V406.423C54.5734 399.307 51.6665 392.47 46.7285 387.385C41.6359 382.3 34.8066 379.54 27.6829 379.54C12.8615 379.54 0.799805 391.602 0.799805 406.423V560.333Z"
          fill="black"
        />
      </svg>
    </button>
  </div>
</template>
