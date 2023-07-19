<script setup lang="ts">
import { sf } from "simpler-fetch";
import type { Product, ReadManyMITDTO } from "domain-model";

const props = defineProps<{ productID: Product["id"] }>();

const { res, err } = await sf
  .useDefault()
  .GET(`/product/MIT/current/${props.productID}`)
  .runJSON<ReadManyMITDTO>();

if (err) throw err;
if (!res.ok) throw new Error("Failed to load MITs");

const MITs = res.data.mits;
</script>

<template>
  <div class="inline-block w-full rounded-lg bg-slate-50 p-4 shadow">
    <div class="flex flex-row items-center justify-between">
      <p class="text-sm font-semibold">MITs (Most Important Tasks)</p>
      <router-link
        v-if="MITs.length !== 0"
        :to="{}"
        class="rounded-lg bg-lime-500 p-1 px-3 text-sm font-semibold text-gray-50"
      >
        All Details
      </router-link>
    </div>

    <div v-if="MITs.length === 0" class="mt-3 text-2xl font-light">
      This will be automatically generated once there are survey responses.
    </div>

    <div v-else>
      <!-- @todo this should be click to toggle done state -->
      <!-- @todo Only see all details if they click into all detals -->
      <router-link
        v-for="(mit, i) in MITs"
        :key="mit.id"
        :to="{}"
        class="mt-3 block rounded-lg border border-slate-300 p-2 text-lg font-light hover:bg-white hover:shadow-xl"
      >
        <span class="mr-2">{{ i + 1 }}.</span>
        {{ mit.task }}
      </router-link>
    </div>
  </div>
</template>
