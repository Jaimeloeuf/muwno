<script setup lang="ts">
import { useRouter } from "vue-router";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import {
  useTeamInvitation,
  useUser,
  useLoader,
  useNotif,
} from "../../../store";
import { AllProductRoute } from "../../../router";
import { getDateString } from "../../../utils/date-formatting/getDateString";
import BackButton from "../../components/BackButton.vue";

const router = useRouter();
const teamInvitationStore = useTeamInvitation();
const userStore = useUser();
const loader = useLoader();
const notif = useNotif();

async function acceptInvitation(invitationID: string) {
  loader.show();

  const { res, err } = await sf
    .useDefault()
    .POST(`/team/member/invite/accept/${invitationID}`)
    .useHeader(getAuthHeader)
    .runVoid((res) => res.json());

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to accept invitation. ${JSON.stringify(res)}`);

  await userStore.refreshJWT(true);

  await teamInvitationStore.removeInvitation(invitationID);

  loader.hide();

  router.push({ name: AllProductRoute.name });
}

async function rejectInvitation(invitationID: string) {
  loader.show();

  const { res, err } = await sf
    .useDefault()
    .POST(`/team/member/invite/reject/${invitationID}`)
    .useHeader(getAuthHeader)
    .runVoid((res) => res.json());

  if (err) throw err;
  if (!res.ok)
    throw new Error(`Failed to reject invitation. ${JSON.stringify(res)}`);

  await teamInvitationStore.removeInvitation(invitationID);

  notif.setSnackbar("Invitation rejected");

  loader.hide();
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-row items-center border-b pb-4">
      <BackButton />
      <p class="ml-4 text-4xl">
        Pending Team Invitation<span
          v-if="teamInvitationStore.invitations.length > 1"
          >s
        </span>
      </p>
    </div>

    <div class="mx-auto max-w-4xl">
      <div class="mx-6 mr-2 flex flex-row justify-between md:mr-12">
        <p class="text-3xl">
          Invitations ({{ teamInvitationStore.invitations.length }})
        </p>

        <button
          class="rounded-lg bg-zinc-100 px-4 font-light text-zinc-900"
          @click="teamInvitationStore.checkForPendingTeamInvitations"
        >
          refresh
        </button>
      </div>

      <div class="mx-6 flex flex-col">
        <div
          v-for="(invitation, index) in teamInvitationStore.invitations"
          :key="invitation.id"
          class="my-3 rounded-lg bg-zinc-100 p-6 text-zinc-900"
        >
          <div class="flex flex-row items-center">
            <p class="pr-3 text-2xl">
              {{ index + 1 }}
            </p>

            <div class="flex-grow border-l border-zinc-200 pl-3">
              <p class="mb-2">
                <b>{{ invitation.inviter.name }}</b> has invited you to join
                <b>{{ invitation.team.name }}</b> on
                {{ getDateString(invitation.createdAt) }}
              </p>

              <hr class="my-4" />

              <div class="flex flex-row space-x-6">
                <button
                  class="rounded-lg bg-red-700 p-2 text-white"
                  @click="rejectInvitation(invitation.id)"
                >
                  reject
                </button>
                <button
                  class="w-full rounded-lg bg-lime-500 p-2 text-white"
                  @click="acceptInvitation(invitation.id)"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
