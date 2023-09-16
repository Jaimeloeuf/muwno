<script setup lang="ts">
import { useTeamInvitationStore } from "../../store";
import { CreateOrgRoute, PendingInvitationRoute } from "../../router";

const teamInvitationStore = useTeamInvitationStore();

await teamInvitationStore.checkForPendingTeamInvitations();

const joinOrg = () =>
  alert("Please ask your team's Owner or Admin to invite you as a member!");
</script>

<template>
  <div>
    <div class="mb-12 border-b pb-4">
      <span class="ml-4 text-4xl">Onboarding</span>
    </div>

    <div class="mx-auto max-w-xl">
      <router-link
        v-if="teamInvitationStore.invitations.length > 0"
        :to="{ name: PendingInvitationRoute.name }"
      >
        <div class="mb-8 w-full rounded-lg bg-green-600 p-4 text-white">
          <p class="mb-2 text-2xl">Pending Invitations</p>
          <p class="font-light">
            See your pending team invitations. You have
            <b>{{ teamInvitationStore.invitations.length }}</b> pending
            invitation right now.
          </p>
        </div>
      </router-link>

      <button v-else class="text-left" @click="joinOrg">
        <div
          class="mb-8 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4"
        >
          <p class="mb-2 text-2xl">Join Organisation</p>
          <p class="font-light">
            Join an existing Organisation by getting your Organisation Admin or
            Owner to send you a team invitation in <i>Team > Invite Member</i>.
          </p>
        </div>
      </button>

      <router-link :to="{ name: CreateOrgRoute.name }">
        <div
          class="mb-8 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4"
        >
          <p class="mb-2 text-2xl">Create Organisation</p>
          <p class="font-light">Create a new Organisation Account.</p>
        </div>
      </router-link>
    </div>
  </div>
</template>
