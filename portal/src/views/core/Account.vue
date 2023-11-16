<script setup lang="ts">
import { auth } from "../../firebase";
import TopNavbar from "../shared/TopNavbar.vue";
import CopyOnClick from "../shared/CopyOnClick.vue";
import { type Role, roleMapper } from "@domain-model";

const userJWT = await auth.currentUser?.getIdTokenResult();
</script>

<template>
  <div>
    <TopNavbar sideDrawer>Account</TopNavbar>

    <div class="mx-auto w-full max-w-screen-sm">
      <p class="mb-2 text-xl">Account Details</p>

      <div class="mb-4 rounded-lg border border-zinc-200 p-3">
        <p class="pb-2 text-lg">User ID</p>

        <CopyOnClick>
          <p class="font-light">{{ auth.currentUser?.uid }}</p>
          <p class="font-extralight">Click to copy ID</p>
        </CopyOnClick>
      </div>

      <div class="rounded-lg border border-zinc-200 p-3">
        <p class="text-lg">Roles</p>
        <ul
          v-if="Array.isArray(userJWT?.claims?.roles)"
          class="list-decimal px-5"
        >
          <li
            v-for="role in (userJWT?.claims.roles as Array<Role>)"
            :key="role"
          >
            {{ roleMapper[role] }}
          </li>
        </ul>
        <p v-else>No Custom Claims</p>
      </div>
    </div>
  </div>
</template>
