<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import { useOrg } from "../../store";
import SideDrawer from "../components/SideDrawer.vue";
import { getDateString } from "../../utils/date-formatting/getDateString";
import type {
  ProductID,
  ReadManyApiKeyDTO,
  ReadOneApiKeyDTO,
  ApiKeyDetailID,
} from "@domain-model";

const props = defineProps<{ productID: ProductID }>();

const orgStore = useOrg();

const product = await orgStore.getProduct(props.productID);

async function getApiKeyDetails() {
  const { res, err } = await sf
    .useDefault()
    .GET(`/api-key/details/${props.productID}`)
    .useHeader(getAuthHeader)
    .runJSON<ReadManyApiKeyDTO>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to load API Key Details ${JSON.stringify(res)}`);

  return res.data.details;
}

async function createApiKey() {
  // @todo add confirmation

  const { res, err } = await sf
    .useDefault()
    .POST(`/api-key/create/${props.productID}`)
    .useHeader(getAuthHeader)
    .runJSON<ReadOneApiKeyDTO>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to create API Key ${JSON.stringify(res)}`);

  apiKeyDetails.value.unshift(res.data);

  // @todo show the api key in a modal so they can copy on click
  console.log("api-key", res.data.key);
}

async function deleteApiKey(apiKeyID: ApiKeyDetailID) {
  // @todo add confirmation on delete
  // @todo add loader

  const { res, err } = await sf
    .useDefault()
    .POST(`/api-key/delete/${apiKeyID}`)
    .useHeader(getAuthHeader)
    .runVoid();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to delete API Key ${JSON.stringify(res)}`);

  apiKeyDetails.value = await getApiKeyDetails();
}

const apiKeyDetails = ref(await getApiKeyDetails());
</script>

<template>
  <div>
    <div class="mb-12 border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">
        <span class="font-light">API Keys for</span> <b>{{ product.name }}</b>
      </span>
    </div>

    <div class="mx-auto w-full max-w-3xl">
      <div
        class="flex flex-col justify-between border-b border-slate-200 pb-6 sm:flex-row sm:items-center"
      >
        <p class="text-xl">
          <b>{{ apiKeyDetails.length }}</b> API Keys for this product
        </p>

        <button
          class="rounded-lg bg-green-600 p-2 px-6 text-white"
          @click="createApiKey"
        >
          Create new API key
        </button>
      </div>

      <div v-if="apiKeyDetails.length === 0" class="mt-6 text-2xl font-thin">
        No API Keys.
      </div>

      <template v-else>
        <div
          v-for="(apiKeyDetail, i) in apiKeyDetails"
          :key="i"
          class="mt-3 flex w-full flex-col items-center border-b border-slate-200 p-2 text-left text-xl sm:flex-row"
        >
          <p class="mr-6">
            {{ i + 1 }}. <i>{{ apiKeyDetail.prefix }}</i>
          </p>

          <p class="flex-grow">
            Created By <u>{{ apiKeyDetail.createdBy }}</u>
          </p>

          <p class="mr-2">{{ getDateString(apiKeyDetail.createdAt) }}</p>

          <button
            class="rounded-lg bg-red-700 px-2 py-0.5 text-white"
            @click="deleteApiKey(apiKeyDetail.id)"
          >
            delete
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
