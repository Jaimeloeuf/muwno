<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { flags } from "../../../utils/flags";
import TopNavbar from "../../shared/TopNavbar.vue";
import type { ReadUsageDTO } from "@domain-model";

async function getUsage() {
  const { res, err } = await sf
    .useDefault()
    .GET(`/usage/org`)
    .useHeader(getAuthHeader)
    .runJSON<ReadUsageDTO>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to get Usage stats: ${JSON.stringify(res)}`);

  return res.data.usage;
}

const usage = await getUsage();
</script>

<template>
  <div>
    <TopNavbar sideDrawer>Usage</TopNavbar>

    <div class="mx-auto flex max-w-2xl flex-col gap-6">
      <p class="text-2xl font-light">Organisation Usage</p>

      <div>
        <p>Responses processed</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ usage.response ?? "-" }}
        </p>
      </div>

      <div>
        <p>Emails sent</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ usage.emailsSent ?? "-" }}
        </p>
      </div>

      <div v-if="flags.devMode">
        <p>SMS sent</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ "-" }}
        </p>
      </div>

      <div>
        <p>Responses stored</p>
        <div class="flex flex-row items-center justify-between pb-2">
          <p class="pr-2">Current</p>
          <p
            class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1"
          >
            {{ usage.responseStored.current ?? "-" }}
          </p>
        </div>

        <div class="flex flex-row items-center justify-between">
          <p class="pr-8">Max</p>
          <p
            class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1"
          >
            {{ usage.responseStored.max ?? "-" }}
          </p>
        </div>
      </div>

      <div v-if="flags.devMode">
        <p>Customers stored</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ "-" }}
        </p>
      </div>

      <div class="py-3"></div>

      <!-- @todo Simplest way is to click and see in Stripe dashboard -->
      <!-- <div>
        <p>Estimated bill, {{}}</p>
      </div> -->
    </div>
  </div>
</template>
