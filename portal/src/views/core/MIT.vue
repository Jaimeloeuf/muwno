<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import type { Product, ReadManyMITDTO, MIT } from "domain-model";

const props = defineProps<{ productID: Product["id"] }>();

const { res, err } = await sf
  .useDefault()
  .GET(`/product/MIT/current/${props.productID}`)
  .useHeader(getAuthHeader)
  .runJSON<ReadManyMITDTO>();

if (err) throw err;
if (!res.ok) throw new Error("Failed to load MITs");

const MITs = ref(res.data.mits);

async function markTaskAsDone(mitID: MIT["id"]) {
  const { res, err } = await sf
    .useDefault()
    .POST(`/product/MIT/done/${mitID}`)
    .useHeader(getAuthHeader)
    .runJSON<ReadManyMITDTO>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to mark MIT as done. ${JSON.stringify(res)}`);

  MITs.value = res.data.mits;
}
</script>

<template>
  <div class="inline-block w-full rounded-lg bg-slate-50 p-4 shadow">
    <div class="flex flex-row items-center justify-between">
      <p class="text-sm font-semibold">MITs (Most Important Tasks)</p>
      <router-link
        v-if="MITs.length !== 0"
        :to="{}"
        class="rounded-lg bg-slate-400 p-1 px-3 text-sm font-semibold text-white"
      >
        See All
      </router-link>
    </div>

    <div v-if="MITs.length === 0" class="mt-3 text-2xl font-thin">
      This will be automatically generated once there are survey responses.
    </div>

    <div v-else>
      <!-- @todo this should be click to toggle done state -->
      <!-- @todo Only see all details if they click into all detals -->
      <button
        v-for="(mit, i) in MITs"
        :key="mit.id"
        class="mt-3 block w-full rounded-lg border border-slate-300 p-2 text-left text-xl font-light hover:bg-white hover:shadow-xl"
        @click="markTaskAsDone(mit.id)"
      >
        <span class="mr-2">{{ i + 1 }}.</span>
        {{ mit.task }}
      </button>
    </div>
  </div>
</template>
