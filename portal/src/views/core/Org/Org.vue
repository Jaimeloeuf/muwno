<script setup lang="ts">
import { useOrg } from "../../../store";
import SideDrawerButton from "../../components/SideDrawerButton.vue";

const orgStore = useOrg();

const org = await orgStore.getOrg();
</script>

<template>
  <div>
    <div class="mb-6 border-b pb-4">
      <SideDrawerButton />
      <span class="ml-4 text-4xl">{{ org.name }}</span>
    </div>

    <div class="mx-6 mb-10 md:mx-12">
      <p class="mb-2 text-xl">Details</p>

      <div class="flex flex-row gap-6">
        <!-- Not showing org.plan until we have more than 1 type of plan -->
        <!-- <div class="w-max rounded-lg border border-zinc-200 p-6">
          <p>Plan</p>

          <p class="text-4xl font-light">
            {{ org.plan }}
          </p>
        </div> -->
      </div>
    </div>
  </div>
</template>
