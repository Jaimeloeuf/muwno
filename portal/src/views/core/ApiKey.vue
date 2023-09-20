<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import { useOrg, useLoader, useNotif } from "../../store";
import SideDrawerButton from "../components/SideDrawerButton.vue";
import CopyOnClick from "../components/CopyOnClick.vue";
import { getDateString } from "../../utils/date-formatting/getDateString";
import type {
  ReadManyApiKeyDTO,
  ReadOneApiKeyDTO,
  ApiKeyDetailID,
} from "@domain-model";

const orgStore = useOrg();
const loader = useLoader();
const notif = useNotif();

const org = await orgStore.getOrg();

const showModal = ref(false);
const newApiKey = ref<string | null>(null);

async function getApiKeyDetails() {
  const { res, err } = await sf
    .useDefault()
    .GET(`/api-key/details`)
    .useHeader(getAuthHeader)
    .runJSON<ReadManyApiKeyDTO>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to load API Key Details ${JSON.stringify(res)}`);

  return res.data.details;
}

async function createApiKey() {
  if (!confirm("Create?")) return;

  loader.show();

  const { res, err } = await sf
    .useDefault()
    .POST(`/api-key/create`)
    .useHeader(getAuthHeader)
    .runJSON<ReadOneApiKeyDTO>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to create API Key ${JSON.stringify(res)}`);

  apiKeyDetails.value.unshift(res.data);

  loader.hide();
  notif.setSnackbar("API Key Created");

  newApiKey.value = res.data.key;
  showModal.value = true;
}

async function deleteApiKey(apiKeyID: ApiKeyDetailID) {
  if (!confirm("Delete?")) return;

  loader.show();

  const { res, err } = await sf
    .useDefault()
    .POST(`/api-key/delete/${apiKeyID}`)
    .useHeader(getAuthHeader)
    .runVoid();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to delete API Key ${JSON.stringify(res)}`);

  apiKeyDetails.value = await getApiKeyDetails();

  loader.hide();
  notif.setSnackbar("API Key Deleted");
}

const apiKeyDetails = ref(await getApiKeyDetails());
</script>

<template>
  <div>
    <div
      v-if="showModal"
      class="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-white p-40"
    >
      <div class="flex flex-col font-light">
        <p class="text-2xl">Click to copy your new API Key</p>
        <p class="pb-4 text-lg">
          Key will only be shown once and cannot be shown again!
        </p>

        <div
          class="rounded-lg border border-zinc-200 bg-zinc-50 p-6"
          @click="(showModal = false), (newApiKey = null)"
        >
          <CopyOnClick>
            {{ newApiKey }}
          </CopyOnClick>
        </div>
      </div>
    </div>

    <div class="mb-12 flex flex-row items-center border-b pb-4">
      <SideDrawerButton />
      <span class="ml-4 text-4xl">
        <span class="font-light">API Keys for</span> <b>{{ org.name }}</b>
      </span>
    </div>

    <div class="mx-auto w-full max-w-5xl">
      <div
        class="flex flex-col justify-between border-b border-zinc-200 pb-6 sm:flex-row sm:items-center"
      >
        <p v-if="apiKeyDetails.length === 0" class="text-2xl font-thin">
          No API Keys right now.
        </p>
        <p v-else class="text-xl">
          API Keys ({{ apiKeyDetails.length }}) for this Organisation
        </p>

        <button
          class="rounded-lg border border-green-600 p-2 px-6 text-green-600"
          @click="createApiKey"
        >
          Create new API key
        </button>
      </div>

      <template v-if="apiKeyDetails.length !== 0">
        <div
          v-for="(apiKeyDetail, i) in apiKeyDetails"
          :key="i"
          class="flex w-full flex-col items-center border-b border-zinc-200 p-4 text-left text-xl font-light sm:flex-row"
        >
          <p class="mr-6">
            {{ i + 1 }}. <i>{{ apiKeyDetail.prefix }}</i>
          </p>

          <p class="flex-grow">
            Created By <u>{{ apiKeyDetail.createdBy }}</u>
          </p>

          <p class="mr-2">{{ getDateString(apiKeyDetail.createdAt) }}</p>

          <button
            class="rounded-lg border border-red-700 px-2 py-0.5 font-extralight text-red-700"
            @click="deleteApiKey(apiKeyDetail.id)"
          >
            delete
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
