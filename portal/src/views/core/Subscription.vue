<script setup lang="ts">
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../firebase";
import { useOrg, useLoader } from "../../store";
import {} from "../../router";
import SideDrawer from "../components/SideDrawer.vue";
import type { Org, ReadManyActivePlanDTO } from "@domain-model";

const orgStore = useOrg();
const loader = useLoader();

// Load details just in case it doesnt exist to prevent this from breaking.
await orgStore.loadOrg();

// Type cast here to ensure that the template types work
// Since there will be runtime check to ensure that it will not be ran.
const orgDetails = orgStore.orgDetails ?? ({} as Org);

async function getPlans() {
  const { res, err } = await sf
    .useDefault()
    .GET(`/subscription/plans`)
    .useHeader(getAuthHeader)
    .runJSON<ReadManyActivePlanDTO>();

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to get active plans: ${JSON.stringify(res)}`);

  return res.data.plans;
}

const plans = await getPlans();
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">Subscription Plan</span>
    </div>

    <div class="mx-6 mb-10 border-b border-gray-200 pb-10 md:mx-12">
      <p class="mb-2 text-xl">Org Details</p>

      <div class="flex flex-row gap-x-6">
        <div class="inline-block w-max rounded-lg bg-slate-50 p-4 px-8 shadow">
          <p class="text-sm">Plan</p>

          <div class="text-right">
            <p class="text-4xl font-light">
              {{ orgDetails.plan }}
            </p>
          </div>
        </div>

        <div
          class="inline-block w-max cursor-pointer rounded-lg bg-slate-50 p-4 px-8 shadow"
        >
          <p class="text-sm">Manage your billing information</p>
          <p class="text-4xl font-light">Billing Portal</p>
        </div>
      </div>
    </div>

    <div class="mx-6 mb-10 md:mx-12">
      <p class="mb-2 text-xl">Buy Subscription Plans</p>

      <div class="grid grid-cols-3 gap-6">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="cursor-pointer rounded-lg bg-slate-50 p-4 px-8 shadow"
        >
          <p class="text-4xl font-light">{{ plan.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
