<script setup lang="ts">
import { auth } from "../../firebase";
import { useOrg } from "../../store";
import TopNavbar from "../shared/TopNavbar.vue";
import { type Role, roleMapper } from "@domain-model";

const orgStore = useOrg();

const org = await orgStore.getOrg();
const userJWT = await auth.currentUser?.getIdTokenResult();
</script>

<template>
  <div>
    <TopNavbar sideDrawer>Profile</TopNavbar>

    <div class="mx-6 mb-10 flex flex-col justify-between lg:flex-row">
      <div class="w-full">
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
      </div>

      <div class="w-full">
        <p class="mb-2 text-xl">Organisation</p>

        <div class="m-3 rounded-lg border border-zinc-200 p-3 font-light">
          <p>Name</p>
          <p class="text-xl">{{ org.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
