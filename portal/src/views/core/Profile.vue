<script setup lang="ts">
import { auth } from "../../firebase";
import { useOrg } from "../../store";
import SideDrawer from "../components/SideDrawer.vue";
import { type Role, roleMapper } from "@domain-model";

const orgStore = useOrg();

const org = await orgStore.getOrg();
const userJWT = await auth.currentUser?.getIdTokenResult();
</script>

<template>
  <div>
    <div class="mb-6 border-b pb-4">
      <SideDrawer />
      <span class="ml-4 text-4xl">Profile</span>
    </div>

    <div class="mx-6 mb-10">
      <p class="mb-2 text-xl">User</p>

      <div class="m-3 rounded-lg border border-zinc-200 p-3 font-light">
        <p>User ID</p>
        <p class="text-xl">{{ auth.currentUser?.uid }}</p>
      </div>

      <div class="m-3 rounded-lg border border-zinc-200 p-3 font-light">
        <p>Roles</p>
        <ul
          v-if="Array.isArray(userJWT?.claims?.roles)"
          class="list-decimal px-5 text-xl"
        >
          <li
            v-for="role in (userJWT?.claims.roles as Array<Role>)"
            :key="role"
          >
            {{ roleMapper[role] }}
          </li>
        </ul>
        <p v-else class="text-xl">No Custom Claims</p>
      </div>

      <hr class="my-12" />

      <div>
        <p class="mb-2 text-xl">Organisation</p>

        <div class="m-3 rounded-lg border border-zinc-200 p-3 font-light">
          <p>Name</p>
          <p class="text-xl">{{ org.name }}</p>
        </div>

        <div class="m-3 rounded-lg border border-zinc-200 p-3 font-light">
          <p>Plan</p>
          <p class="text-xl">{{ org.plan }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
