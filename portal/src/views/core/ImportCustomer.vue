<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { parse } from "papaparse";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import { useOrg, useLoader, useNotif } from "../../store";
import BackButton from "../components/BackButton.vue";
import type {
  CreateOneCustomerDTO,
  CreateManyCustomerDTO,
} from "@domain-model";

const router = useRouter();
const orgStore = useOrg();
const loader = useLoader();
const notif = useNotif();

const org = await orgStore.getOrg();
const localFile = ref<File | null>(null);

// Generate relative CSV url as cannot load from the URL directly in template.
const customerTemplateUrl = new URL(
  "../../assets/import-customer-template.csv",
  import.meta.url
).href;

async function onFileChanged(event: Event) {
  const target = event.target;
  if (target === null) {
    console.error("No target in onFileChanged event");
    return;
  }

  const files = (target as HTMLInputElement).files;
  if (files === null) {
    console.error("No files in onFileChanged");
    return;
  }

  const [file] = files;
  if (file === undefined) {
    console.error("Cannot get file in onFileChanged");
    return;
  }

  localFile.value = file;
}

async function processFile() {
  const file = localFile.value;
  if (file === null) {
    console.error("Missing file to process");
    return;
  }

  if (!confirm("Do not close browser tab while processing and uploading!"))
    return;

  loader.show("Parsing Customer CSV");

  const csvString = await file.text();
  const result = parse<Array<string | undefined>>(csvString, {
    // Greedy will skip lines with all completely columns.
    skipEmptyLines: "greedy",
  });

  if (result.errors.length > 0) {
    result.errors.forEach(console.error);
    return;
  }

  const customers: Array<CreateOneCustomerDTO> = [];

  /** Convert empty strings and undefined values to null */
  const convertToNull = (v: string | undefined) =>
    v === "" || v === undefined ? null : v;

  // Skip the 1st row of headers
  for (let i = 1; i < result.data.length; i++) {
    const [cid, name, email, phone, createdAt] = result.data[i] ?? [];
    customers.push({
      cid: convertToNull(cid),
      name: convertToNull(name),
      email: convertToNull(email),
      phone: convertToNull(phone),
      createdAt: convertToNull(createdAt),
    });
  }

  if (customers.length === 0) {
    alert("CSV cannot be empty!");
    return;
  }

  // Loop through the array in chunks of 100 elements at a time to upload them
  // part by part instead of overwhelming the server or erroring out with
  // 'request entity too large'
  for (let i = 0; i < customers.length; i += 100) {
    // Pagination limit
    const pageLimit = i + 100 < customers.length ? i + 100 : customers.length;

    console.log(
      `Uploading customer ${i} - ${pageLimit} out of ${customers.length}`
    );
    loader.show(
      `Keep this browser tab open! Uploading customer ${i} - ${pageLimit} out of ${customers.length}`
    );

    await uploadCustomers(customers.slice(i, pageLimit));
  }

  loader.hide();

  notif.setSnackbar(`Successfully imported ${customers.length} customers.`);

  // @todo Accept a next route as URL Query
  router.back();
}

async function uploadCustomers(customers: Array<CreateOneCustomerDTO>) {
  const { res, err } = await sf
    .useDefault()
    .POST(`/customer/upload/batch/${org.id}`)
    .bodyJSON<CreateManyCustomerDTO>({ customers })
    .useHeader(getAuthHeader)
    .runVoid();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to import customers: ${JSON.stringify(res)}`);
}
</script>

<template>
  <div>
    <div class="mb-12 flex flex-row items-center border-b pb-4">
      <BackButton />
      <span class="ml-4 text-4xl">Import Customers manually</span>
    </div>

    <div class="mx-auto w-full max-w-md">
      <div class="mb-10">
        <!-- @todo Add a screenshot of the sample template -->

        <p class="pb-2">
          1. Download the template CSV, add in your customer details and upload
          it to import users manually.
        </p>

        <a :href="customerTemplateUrl" download>
          <div
            class="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center"
          >
            Download Template CSV
          </div>
        </a>
      </div>

      <!-- @todo Change this into a file upload drop zone -->
      <div>
        <label for="upload">
          <p class="pb-2">2. Upload CSV file filled with customer data</p>

          <div
            class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center"
          >
            <svg
              class="m-0 inline-block h-5 w-6 p-0"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.19616 15.9998C1.6137 15.9998 1.0551 15.7685 0.643241 15.3566C0.231381 14.9447 0 14.3861 0 13.8037V10.6663C3.7197e-09 10.4167 0.0991632 10.1773 0.275675 10.0008C0.452186 9.82426 0.691587 9.7251 0.941212 9.7251C1.19084 9.7251 1.43024 9.82426 1.60675 10.0008C1.78326 10.1773 1.88242 10.4167 1.88242 10.6663V13.8037C1.88242 13.9769 2.02298 14.1174 2.19616 14.1174H15.3731C15.4563 14.1174 15.5361 14.0844 15.595 14.0255C15.6538 13.9667 15.6869 13.8869 15.6869 13.8037V10.6663C15.6869 10.4167 15.786 10.1773 15.9625 10.0008C16.1391 9.82426 16.3785 9.7251 16.6281 9.7251C16.8777 9.7251 17.1171 9.82426 17.2936 10.0008C17.4701 10.1773 17.5693 10.4167 17.5693 10.6663V13.8037C17.5693 14.3861 17.3379 14.9447 16.9261 15.3566C16.5142 15.7685 15.9556 15.9998 15.3731 15.9998H2.19616Z"
                fill="gray"
              />
              <path
                d="M13.5284 4.35437C13.6157 4.44171 13.685 4.54541 13.7323 4.65953C13.7795 4.77365 13.8039 4.89597 13.8039 5.01949C13.8039 5.14302 13.7795 5.26533 13.7323 5.37945C13.685 5.49358 13.6157 5.59727 13.5284 5.68462C13.441 5.77196 13.3373 5.84125 13.2232 5.88852C13.1091 5.93579 12.9868 5.96012 12.8632 5.96012C12.7397 5.96012 12.6174 5.93579 12.5033 5.88852C12.3892 5.84125 12.2855 5.77196 12.1981 5.68462L9.72587 3.21362V10.353C9.72587 10.6027 9.6267 10.8421 9.45019 11.0186C9.27368 11.1951 9.03428 11.2942 8.78466 11.2942C8.53503 11.2942 8.29563 11.1951 8.11912 11.0186C7.94261 10.8421 7.84344 10.6027 7.84344 10.353V3.21362L5.37119 5.68462C5.28385 5.77196 5.18015 5.84125 5.06603 5.88852C4.95191 5.93579 4.82959 5.96012 4.70607 5.96012C4.58254 5.96012 4.46023 5.93579 4.34611 5.88852C4.23198 5.84125 4.12829 5.77196 4.04094 5.68462C3.9536 5.59727 3.88431 5.49358 3.83704 5.37945C3.78977 5.26533 3.76544 5.14302 3.76544 5.01949C3.76544 4.89597 3.78977 4.77365 3.83704 4.65953C3.88431 4.54541 3.9536 4.44171 4.04094 4.35437L8.11953 0.275781C8.20683 0.188356 8.31051 0.118999 8.42464 0.0716782C8.53877 0.0243572 8.66111 0 8.78466 0C8.90821 0 9.03054 0.0243572 9.14467 0.0716782C9.2588 0.118999 9.36248 0.188356 9.44978 0.275781L13.5284 4.35437Z"
                fill="gray"
              />
            </svg>

            Upload CSV File
            <input
              id="upload"
              type="file"
              class="hidden"
              @change="onFileChanged($event)"
            />
          </div>
        </label>

        <div v-if="localFile" class="pt-2">
          <p class="text-yellow-800">
            Uploaded <i>{{ localFile.name }}</i>
          </p>
        </div>
      </div>

      <!-- @todo Add a youtube video to demo how to use it -->

      <div v-if="localFile !== null">
        <hr class="my-10" />

        <p class="pb-4">
          Customers you import will be saved automatically for you to reuse in
          the future!
        </p>

        <button
          class="w-full rounded-lg border border-green-600 p-4 text-xl text-green-600"
          @click="processFile"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>
