<script setup lang="ts">
import { useOrg } from "../../../store";
import SideDrawer from "../../components/SideDrawer.vue";

const orgStore = useOrg();

const orgDetails = await orgStore.getOrg();
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
