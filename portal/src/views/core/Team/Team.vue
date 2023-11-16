<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useOrg, useUser } from "../../../store";
import { InviteMemberRoute } from "../../../router";
import { useSearch } from "../../../composable";
import TopNavbar from "../../shared/TopNavbar.vue";
import Accordion from "../../shared/Accordion.vue";
import { getDateString } from "../../../utils/date-formatting/getDateString";
import { type ReadManyUserDTO, Role, roleMapper } from "@domain-model";

const orgStore = useOrg();
const userStore = useUser();

const user = await userStore.getUser();

const org = await orgStore.getOrg();

const { res, err } = await sf
  .useDefault()
  .GET(`/team/member/all`)
  .useHeader(getAuthHeader)
  .runJSON<ReadManyUserDTO>();

if (err) throw err;
if (!res.ok) throw new Error("Failed to load Team Members");

const teamMembers = ref(res.data.users);

/** Ref to the DOM element so that it can be cleared by `clearSearchInputHandler` */
const searchField = ref<HTMLInputElement | null>(null);

const { searchInput, results, clearSearchInput } = useSearch(
  teamMembers,
  { keys: ["name"], threshold: 0.5, resultLimit: 5 },
  () => searchField.value?.focus()
);
</script>

<template>
  <div>
    <TopNavbar sideDrawer>{{ org.name }}</TopNavbar>

    <!-- @todo -->
    <!-- OrgOwner/OrgAdmin can see all active invites that have not been accepted -->
    <!-- OrgOwner/OrgAdmin should be able to remove a team member -->

    <div class="mx-auto max-w-4xl">
      <p class="pb-4 text-xl">Team Members ({{ teamMembers.length }})</p>

      <div
        class="flex flex-col items-center justify-between gap-3 pb-6 md:flex-row"
      >
        <div class="flex w-full max-w-md flex-row gap-3">
          <input
            ref="searchField"
            v-model.trim="searchInput"
            type="text"
            class="w-full rounded-lg border border-zinc-200 p-2 px-4 focus:outline-none"
            placeholder="Search by Name"
          />

          <button
            class="rounded-lg bg-zinc-100 px-4 text-sm font-light text-zinc-900"
            @click="clearSearchInput"
          >
            clear
          </button>
        </div>

        <router-link
          v-if="user.role === Role.OrgOwner || user.role === Role.OrgAdmin"
          :to="{ name: InviteMemberRoute.name }"
          class="inline-flex w-full max-w-xs items-center justify-between rounded-lg border border-green-600 px-4 py-1 text-green-600"
        >
          <div>Invite Team Member</div>
          <svg
            class="h-8 w-8"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </router-link>
      </div>

      <p
        v-if="searchInput !== '' && results.length === 0"
        class="text-2xl font-thin"
      >
        No user matches your search.
      </p>

      <div class="flex flex-col gap-4">
        <div
          v-for="teamMember in results"
          :key="teamMember.id"
          class="rounded-lg border border-zinc-200 px-4 text-zinc-800 md:px-6"
        >
          <Accordion>
            <template #summary>
              <p class="text-lg">
                {{ teamMember.name }}
              </p>
            </template>

            <template #content>
              <p v-if="teamMember.role !== undefined" class="pb-2">
                {{ roleMapper[teamMember.role] }}
              </p>
              <p class="pb-2">{{ teamMember.email }}</p>
              <p class="pb-2">
                Joined on {{ getDateString(teamMember.createdAt) }}
              </p>
              <p>{{ teamMember.phone }}</p>
            </template>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>
