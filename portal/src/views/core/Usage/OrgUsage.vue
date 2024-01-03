<script setup lang="ts">
import { ref, watch } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useLoader, useError } from "../../../store";
import { prettyJSON, flags, getDateString } from "../../../utils";
import TopNavbar from "../../shared/TopNavbar.vue";
import type { ReadUsageDTO } from "@domain-model";

const loader = useLoader();
const errorStore = useError();

/**
 * value is in seconds
 */
const timeRanges = [
  { name: "Last 24 hours", value: 86400 },
  { name: "Last week", value: 604800 },
  { name: "Last 2 weeks", value: 1.21e6 },
  { name: "Last month", value: 2.592e6 },
  { name: "Current Billing Cycle", value: 0 },
] as const;
const selectedTimeRange = ref<(typeof timeRanges)[number]["value"]>(2.592e6);

async function getUsage() {
  const { res, err } = await sf
    .useDefault()
    .GET(
      selectedTimeRange.value === 0
        ? `/usage/org/current-billing-period`
        : `/usage/org?timeRange=${selectedTimeRange.value}`
    )
    .useHeader(getAuthHeader)
    .runJSON<ReadUsageDTO>();

  if (err) return err;
  if (!res.ok)
    return new Error(`Failed to get Usage stats: ${prettyJSON(res)}`);

  return res.data.usage;
}

const usageResult = await getUsage();
if (usageResult instanceof Error) throw usageResult;
const usage = ref(usageResult);

watch(selectedTimeRange, async () => {
  loader.show();
  const usageResult = await getUsage();
  loader.hide();

  if (usageResult instanceof Error) {
    errorStore.newError(usageResult);
    return;
  }

  usage.value = usageResult;
});
</script>

<template>
  <div>
    <TopNavbar sideDrawer>Usage</TopNavbar>

    <div class="mx-auto flex max-w-lg flex-col gap-6">
      <div>
        <div class="flex flex-col justify-between gap-4 sm:flex-row">
          <p class="text-2xl">Organisation Usage</p>

          <select
            v-model="selectedTimeRange"
            class="rounded-lg border border-zinc-200 p-2.5 focus:outline-none"
          >
            <option
              v-for="timeRange in timeRanges"
              :key="timeRange.value"
              :value="timeRange.value"
              :selected="timeRange.value === selectedTimeRange"
            >
              {{ timeRange.name }}
            </option>
          </select>
        </div>

        <p class="pr-2 pt-1 text-right text-sm font-light">
          {{ getDateString(usage.from) }} <span class="px-2 font-bold">-</span>
          {{ getDateString(usage.to) }}
        </p>
      </div>

      <div>
        <p class="text-lg">Responses Processed</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ usage.response ?? "-" }}
        </p>
      </div>

      <div>
        <p class="text-lg">Emails Sent</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ usage.emailsSent ?? "-" }}
        </p>
      </div>

      <div v-if="flags.devMode">
        <p class="text-lg">SMS Sent</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ "-" }}
        </p>
      </div>

      <div>
        <p class="text-lg">Responses Stored</p>
        <div class="flex flex-row items-center justify-between pb-2">
          <p class="pr-4">Current</p>
          <p
            class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1"
          >
            {{ usage.responseStored.current ?? "-" }}
          </p>
        </div>

        <div class="flex flex-row items-center justify-between">
          <p class="pr-10">Max</p>
          <p
            class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1"
          >
            {{ usage.responseStored.max ?? "-" }}
          </p>
        </div>
      </div>

      <div v-if="flags.devMode" class="text-lg">
        <p>Customers Stored</p>
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
