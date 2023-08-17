<script setup lang="ts">
import { useRouter } from "vue-router";
import { useOrg } from "../../store";
import { CreateOrgRoute } from "../../router";
import SideDrawer from "../components/SideDrawer.vue";
import type { Org } from "@domain-model";

const router = useRouter();
const orgStore = useOrg();

// Load details just in case it doesnt exist to prevent this from breaking.
await orgStore.loadOrg();

// Type cast here to ensure that the template types work
// Since there will be runtime check to ensure that it will not be ran.
const orgDetails = orgStore.orgDetails ?? ({} as Org);

// If user does not have an org, bring user to create org vue
if (orgDetails === undefined) router.push({ name: CreateOrgRoute.name });
</script>

<template>
  <div>
    <div class="mb-6 border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">{{ orgDetails.name }}</span>
    </div>

    <div class="mx-6 mb-10 md:mx-12">
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
      </div>
    </div>
  </div>
</template>
