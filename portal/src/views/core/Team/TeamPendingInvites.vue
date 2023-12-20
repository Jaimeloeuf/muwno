<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useUser, useLoader, useError } from "../../../store";
import { InviteMemberRoute } from "../../../router";
import { useSearch } from "../../../composable";
import TopNavbar from "../../shared/TopNavbar.vue";
import Accordion from "../../shared/Accordion.vue";
import { getDateString } from "../../../utils/date-formatting/getDateString";
import { Role, roleMapper } from "@domain-model";
import type { ReadManyTeamMemberInvitationDTO } from "@domain-model";

const userStore = useUser();
const loader = useLoader();
const errorStore = useError();

const user = await userStore.getUser();
const userIsAdmin = user.role === Role.OrgOwner || user.role === Role.OrgAdmin;

async function getInvites() {
  const { res, err } = await sf
    .useDefault()
    .GET(`/team/invites/pending/org`)
    .useHeader(getAuthHeader)
    .runJSON<ReadManyTeamMemberInvitationDTO>();

  if (err) return err;
  if (!res.ok)
    return new Error(`Failed to load Pending Invites ${JSON.stringify(res)}`);

  return res.data.invitations;
}

const inviteResult = await getInvites();
if (inviteResult instanceof Error) throw inviteResult;
const invites = ref(inviteResult);

/** Ref to the DOM element so that it can be cleared by `clearSearchInputHandler` */
const searchField = ref<HTMLInputElement | null>(null);

const { searchInput, results, clearSearchInput } = useSearch(
  invites,
  { keys: ["inviteeEmail"], threshold: 0.5, resultLimit: 5 },
  () => searchField.value?.focus()
);
</script>

<template>
  <div>
    <TopNavbar sideDrawer back>Pending Invites</TopNavbar>

    <!-- @todo   OrgOwner/OrgAdmin can delete pending invites -->
    <div class="mx-auto max-w-4xl">
      <div class="flex flex-row items-center justify-between">
        <p class="pb-4 text-xl">Team Members ({{ invites.length }})</p>
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
          v-for="invite in results"
          :key="invite.id"
          class="rounded-lg border border-zinc-200 px-4 text-zinc-800 md:px-6"
        >
          <Accordion>
            <template #summary>
              <p class="text-lg">
                {{ invite.inviteeEmail }}
              </p>
            </template>

            <template #content>
              <p class="pb-2">
                {{ roleMapper[invite.inviter.role] }}
                {{ invite.inviter.name }} invited {{ invite.inviteeEmail }} on
                {{ getDateString(invite.createdAt) }} to be a
                {{ roleMapper[invite.role] }}
              </p>
            </template>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>
