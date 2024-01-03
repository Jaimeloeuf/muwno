<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useOrg, useUser, useLoader, useError } from "../../../store";
import { TeamPendingInvitesRoute, InviteMemberRoute } from "../../../router";
import { useSearch } from "../../../composable";
import TopNavbar from "../../shared/TopNavbar.vue";
import Accordion from "../../shared/Accordion.vue";
import RemoveUserButton from "./RemoveUserButton.vue";
import { getDateString } from "../../../utils";
import { Role, roleMapper } from "@domain-model";
import type { UserID, ReadManyUserDTO } from "@domain-model";

const orgStore = useOrg();
const userStore = useUser();
const loader = useLoader();
const errorStore = useError();

const user = await userStore.getUser();
const userIsAdmin = user.role === Role.OrgOwner || user.role === Role.OrgAdmin;

const org = await orgStore.getOrg();

async function getMembers() {
  const { res, err } = await sf
    .useDefault()
    .GET(`/team/member/all`)
    .useHeader(getAuthHeader)
    .runJSON<ReadManyUserDTO>();

  if (err) return err;
  if (!res.ok)
    return new Error(`Failed to load Team Members ${JSON.stringify(res)}`);

  return res.data.users;
}

const teamMembersResult = await getMembers();
if (teamMembersResult instanceof Error) throw teamMembersResult;
const teamMembers = ref(teamMembersResult);

/** Ref to the DOM element so that it can be cleared by `clearSearchInputHandler` */
const searchField = ref<HTMLInputElement | null>(null);

const { searchInput, results, clearSearchInput } = useSearch(
  teamMembers,
  { keys: ["name"], threshold: 0.5, resultLimit: 5 },
  () => searchField.value?.focus()
);

async function reloadMembers() {
  loader.show();
  const teamMembersResult = await getMembers();
  loader.hide();

  if (teamMembersResult instanceof Error) {
    errorStore.newError(teamMembersResult);
    return;
  }

  teamMembers.value = teamMembersResult;
}

/**
 * Function to determine if the current user can remove the given user from the
 * Organisation/Team. It can be removed as long as it is not the current user's
 * own account and not the OrgOwner.
 */
const canRemove = (userID: UserID, userRole?: Role) =>
  userID !== user.id && userRole !== Role.OrgOwner;
</script>

<template>
  <div>
    <TopNavbar sideDrawer>{{ org.name }}</TopNavbar>

    <div class="mx-auto max-w-4xl">
      <div class="flex flex-row items-center justify-between">
        <p class="pb-4 text-xl">Team Members ({{ teamMembers.length }})</p>
        <router-link
          v-if="userIsAdmin"
          :to="{ name: TeamPendingInvitesRoute.name }"
          class="font-thin underline decoration-zinc-300"
        >
          Pending Invites
        </router-link>
      </div>

      <div
        class="flex flex-col items-center justify-between gap-3 pb-6 md:flex-row"
      >
        <div class="flex w-full max-w-xs flex-row gap-3">
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
          v-if="userIsAdmin"
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
              <p class="pb-2">{{ teamMember.phone }}</p>

              <RemoveUserButton
                v-if="userIsAdmin && canRemove(teamMember.id, teamMember.role)"
                :user="teamMember"
                @removed="reloadMembers"
              />
            </template>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>
