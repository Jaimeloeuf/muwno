<script setup lang="ts">
import { useOrg } from "../../../store";
import TopNavbar from "../../components/TopNavbar.vue";
import CopyOnClick from "../../components/CopyOnClick.vue";

const orgStore = useOrg();

const org = await orgStore.getOrg();
</script>

<template>
  <div>
    <TopNavbar sideDrawer>{{ org.name }}</TopNavbar>

    <div class="max-w-md md:mx-12">
      <p class="mb-2 text-2xl">Details</p>

      <div class="rounded-lg border border-zinc-200 p-3">
        <p class="mb-3 border-b border-zinc-200 pb-2 text-lg">
          Organisation ID
        </p>

        <CopyOnClick>
          <p class="break-words">
            {{ org.id }}
          </p>
          <p class="font-extralight">Click to copy ID</p>
        </CopyOnClick>
      </div>
    </div>
  </div>
</template>
