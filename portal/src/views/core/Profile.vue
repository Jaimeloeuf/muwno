<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { useOrg } from "../../store";
import SideDrawer from "../components/SideDrawer.vue";

const { user } = useAuth0();
const orgStore = useOrg();

const orgDetails = orgStore.orgDetails;
if (orgDetails === undefined)
  throw new Error("Profile.vue: Org details is undefined");
</script>

<template>
  <div>
    <div class="mb-6 border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">Profile</span>
    </div>

    <div class="mx-6 mb-10">
      <p class="mb-2 text-xl">User</p>

      <div class="m-3 rounded-lg bg-slate-200 p-3">
        <pre>{{ user }}</pre>
      </div>

      <hr class="my-12" />

      <p class="mb-2 text-xl">Organisation</p>

      <div class="m-3 rounded-lg bg-slate-200 p-3">
        <p>Name</p>
        <p class="text-xl">{{ orgDetails.name }}</p>
      </div>

      <div class="m-3 rounded-lg bg-slate-200 p-3">
        <p>Plan</p>
        <p class="text-xl">{{ orgDetails.plan }}</p>
      </div>
    </div>
  </div>
</template>
