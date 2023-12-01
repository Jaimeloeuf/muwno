<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import { useUser, useLoader, useNotif } from "../../store";
import TopNavbar from "../shared/TopNavbar.vue";
import CopyOnClick from "../shared/CopyOnClick.vue";
import Accordion from "../shared/Accordion.vue";
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

  newApiKey.value = res.data.key;
  showModal.value = true;
  notif.setSnackbar("API Key Created");
}

function keyCopied() {
  showModal.value = false;
  newApiKey.value = null;
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
      class="fixed left-0 top-0 z-[35] flex h-screen w-screen items-center justify-center bg-black bg-opacity-90 p-4"
    >
      <div class="flex flex-col rounded-lg bg-white p-6 font-light">
        <p class="pb-2 text-2xl">Copy your API Key</p>
        <p class="pb-4">
          <b>Key can only be shown once.</b>
          Copy it somewhere safe as it cannot be shown again!
        </p>

        <CopyOnClick :textToCopy="newApiKey">
          <div
            class="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            @click="keyCopied"
          >
            {{ newApiKey }}
            <p class="pt-4 text-right font-medium sm:pt-0">
              Click to copy API Key
            </p>
          </div>
        </CopyOnClick>
      </div>
    </div>

    <TopNavbar sideDrawer>API Keys</TopNavbar>

    <div class="mx-auto w-full max-w-5xl">
      <div
        class="flex flex-col justify-between gap-3 border-b border-zinc-200 pb-3 sm:flex-row sm:items-center"
      >
        <p v-if="apiKeyDetails.length === 0" class="text-2xl font-thin">
          No API Keys right now.
        </p>
        <p v-else class="text-xl">
          {{ apiKeyDetails.length }} API Keys for this Organisation
        </p>

        <button
          v-if="isAdmin"
          class="rounded-lg border border-green-600 p-1.5 px-6 text-green-600"
          @click="createApiKey"
        >
          Create new API key
        </button>
        <div v-else class="rounded-lg border border-zinc-200 p-1.5 px-4">
          Only Admins can create new API keys
        </div>
      </div>

      <div v-if="apiKeyDetails.length !== 0" class="flex flex-col gap-4 pt-8">
        <div
          v-for="(apiKeyDetail, i) in apiKeyDetails"
          :key="apiKeyDetail.id"
          class="rounded-lg border border-zinc-200 px-4 text-zinc-800 md:px-6"
        >
          <Accordion class="w-full">
            <template #summary>
              <p class="text-xl tracking-widest">
                {{ i + 1 }}. <i>{{ apiKeyDetail.prefix }}</i>
              </p>
            </template>

            <template #content>
              <p class="pb-2">Created by, {{ apiKeyDetail.createdBy }}</p>
              <p class="pb-3">{{ getDateString(apiKeyDetail.createdAt) }}</p>
              <button
                v-if="isAdmin"
                class="rounded-lg border border-red-700 px-2 text-red-700"
                @click="deleteApiKey(apiKeyDetail.id)"
              >
                delete
              </button>
            </template>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>
