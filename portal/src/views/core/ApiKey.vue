<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import { useUser, useLoader, useNotif } from "../../store";
import TopNavbar from "../shared/TopNavbar.vue";
import CopyOnClick from "../shared/CopyOnClick.vue";
import { getDateString } from "../../utils/date-formatting/getDateString";
import { Role } from "@domain-model";
import type {
  ReadManyApiKeyDTO,
  ReadOneApiKeyDTO,
  ApiKeyDetailID,
} from "@domain-model";

const userStore = useUser();
const loader = useLoader();
const notif = useNotif();

const user = await userStore.getUser();
const isAdmin = user.role === Role.OrgOwner || user.role === Role.OrgAdmin;

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
    .POST(`/api-key`)
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
    .DEL(`/api-key/${apiKeyID}`)
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
      v-if="showModal && newApiKey !== null"
      class="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white p-40"
    >
      <div class="flex flex-col font-light">
        <p class="text-2xl">Click to copy your new API Key</p>
        <p class="pb-4 text-lg">
          Key will only be shown once and cannot be shown again!
        </p>

        <CopyOnClick :textToCopy="newApiKey">
          <div
            class="rounded-lg border border-zinc-200 bg-zinc-50 p-6"
            @click="(showModal = false), (newApiKey = null)"
          >
            {{ newApiKey }}
          </div>
        </CopyOnClick>
      </div>
    </div>

    <TopNavbar sideDrawer>API Keys</TopNavbar>

    <div class="mx-auto w-full max-w-5xl">
      <div
        class="flex flex-col justify-between gap-3 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center"
      >
        <p v-if="apiKeyDetails.length === 0" class="text-2xl font-thin">
          No API Keys right now.
        </p>
        <p v-else class="text-xl">
          API Keys ({{ apiKeyDetails.length }}) for this Organisation
        </p>

        <button
          v-if="isAdmin"
          class="rounded-lg border border-green-600 p-2 px-6 text-green-600"
          @click="createApiKey"
        >
          Create new API key
        </button>
        <div v-else class="rounded-lg border border-zinc-200 p-2 px-4">
          Only Admins can create new API keys
        </div>
      </div>

      <template v-if="apiKeyDetails.length !== 0">
        <div
          v-for="(apiKeyDetail, i) in apiKeyDetails"
          :key="i"
          class="flex w-full flex-col gap-3 border-t border-zinc-200 p-4 text-xl font-light sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="pr-4">
            {{ i + 1 }}. <i>{{ apiKeyDetail.prefix }}</i>
          </p>

          <p class="flex-grow">
            Created By <u>{{ apiKeyDetail.createdBy }}</u>
          </p>

          <p>{{ getDateString(apiKeyDetail.createdAt) }}</p>

          <button
            v-if="isAdmin"
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
