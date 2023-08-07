<script setup lang="ts">
import { auth } from "../../firebase";
import { useOrg } from "../../store";
import SideDrawer from "../components/SideDrawer.vue";
import { type Role, roleMapper } from "@domain-model";

const orgStore = useOrg();

const orgDetails = orgStore.orgDetails;
if (orgDetails === undefined)
  throw new Error("Profile.vue: Org details is undefined");

const claims = await auth.currentUser?.getIdTokenResult();
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
        <p>User ID</p>
        <p class="text-xl">{{ auth.currentUser?.uid }}</p>
      </div>

      <div class="m-3 rounded-lg bg-slate-200 p-3">
        <p>Roles</p>
        <p class="text-xl">
          {{
            (claims?.claims as any).roles.map((role: Role) => roleMapper[role])
          }}
        </p>
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
