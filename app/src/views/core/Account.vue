<script setup lang="ts">
import { auth } from "../../utils";
import TopNavbar from "../shared/TopNavbar.vue";
import CopyOnClick from "../shared/CopyOnClick.vue";
import { type Role, roleMapper } from "@domain-model";

const userJWT = await auth.currentUser?.getIdTokenResult();
const userID = auth.currentUser?.uid ?? "";
</script>

<template>
  <div>
    <TopNavbar sideDrawer>Account</TopNavbar>

    <div class="mx-auto w-full max-w-screen-sm">
      <p class="mb-2 text-xl">Account Details</p>

      <div class="mb-4 w-full rounded-lg border border-zinc-200 p-3">
        <div
          class="mb-2 flex flex-row items-center justify-between border-b border-zinc-200 pb-1.5"
        >
          <p>User ID</p>
          <CopyOnClick
            class="rounded-lg border border-zinc-200 bg-zinc-50 px-2 font-light text-zinc-900"
            :textToCopy="userID"
          >
            Copy
          </CopyOnClick>
        </div>

        <p class="break-all font-light">
          {{ userID }}
        </p>
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
