<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useOrg } from "../../../store";
import { ImportCustomerRoute } from "../../../router";
import TopNavbar from "../../shared/TopNavbar.vue";
import { numberFormatter } from "../../../utils/numericalFormatter";
import type { ReadCustomerCountDTO } from "@domain-model";

const orgStore = useOrg();
const org = await orgStore.getOrg();

async function getCustomerCount() {
  const { res, err } = await sf
    .useDefault()
    .GET(`/customer/count/${org.id}`)
    .useHeader(getAuthHeader)
    .runJSON<ReadCustomerCountDTO>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to get Customer Count: ${JSON.stringify(res)}`);

  return res.data.count;
}

async function getCustomerGroups() {
  const { res, err } = await sf
    .useDefault()
    .GET(`/customer/group/of-org/${org.id}`)
    .useHeader(getAuthHeader)
    .runJSON<{ groups: unknown }>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to get Customer Groups: ${JSON.stringify(res)}`);

  return res.data.groups;
}

const customerCount = await getCustomerCount();
const customerGroups = await getCustomerGroups();

customerGroups;
</script>

<template>
  <div>
    <TopNavbar sideDrawer>Customers</TopNavbar>

    <div class="md:mx-6">
      <div class="flex flex-col md:flex-row md:gap-6">
        <div class="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p class="text-sm font-medium">Customers Stored</p>
          <p class="text-right">
            {{ numberFormatter(customerCount) }}
          </p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:gap-6">
        <router-link
          :to="{}"
          class="mb-6 flex flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4"
        >
          See All Customers

          <svg
            class="ml-4 h-3 w-3 shrink-0 rotate-90 transition duration-150"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </router-link>

        <router-link
          :to="{ name: ImportCustomerRoute.name }"
          class="mb-6 flex flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4"
        >
          Import Customers manually

          <svg
            class="ml-4 h-3 w-3 shrink-0 rotate-90 transition duration-150"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </router-link>

        <router-link
          :to="{}"
          class="mb-6 flex flex-row items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4"
        >
          Setup API integration

          <svg
            class="ml-4 h-3 w-3 shrink-0 rotate-90 transition duration-150"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </router-link>
      </div>

      <div>
        <p class="text-2xl">Groups</p>
        <p class="font-light">
          Use customer groups to survey your customers grouped by certain
          properties.
        </p>
      </div>
    </div>
  </div>
</template>
