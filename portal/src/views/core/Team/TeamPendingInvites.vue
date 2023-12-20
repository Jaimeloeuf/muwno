<script setup lang="ts">
import { ref } from "vue";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useLoader, useError } from "../../../store";
import { useSearch } from "../../../composable";
import TopNavbar from "../../shared/TopNavbar.vue";
import Accordion from "../../shared/Accordion.vue";
import DeletePendingInviteButton from "./DeletePendingInviteButton.vue";
import { getDateString } from "../../../utils/date-formatting/getDateString";
import { roleMapper } from "@domain-model";
import type { ReadManyTeamMemberInvitationDTO } from "@domain-model";

const loader = useLoader();
const errorStore = useError();

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

async function reloadInvites() {
  loader.show();
  const inviteResult = await getInvites();
  loader.hide();

  if (inviteResult instanceof Error) {
    errorStore.newError(inviteResult);
    return;
  }

  invites.value = inviteResult;
}
</script>

<template>
  <div>
    <TopNavbar sideDrawer back>Pending Invites</TopNavbar>

    <div class="mx-auto max-w-4xl">
      <div class="flex flex-row items-center justify-between">
        <p class="pb-4 text-xl">Pending invitations ({{ invites.length }})</p>
      </div>

      <div class="flex w-full max-w-xs flex-row gap-3 pb-6">
        <input
          ref="searchField"
          v-model.trim="searchInput"
          type="text"
          class="w-full rounded-lg border border-zinc-200 p-2 px-4 focus:outline-none"
          placeholder="Search by Email"
        />

        <button
          class="rounded-lg bg-zinc-100 px-4 text-sm font-light text-zinc-900"
          @click="clearSearchInput"
        >
          clear
        </button>
      </div>

      <p
        v-if="searchInput !== '' && results.length === 0"
        class="text-2xl font-thin"
      >
        No invitation matches your search.
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

              <DeletePendingInviteButton
                :invitation="invite"
                @deleted="reloadInvites"
              />
            </template>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
</template>
