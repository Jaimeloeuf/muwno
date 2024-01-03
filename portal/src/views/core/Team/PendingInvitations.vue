<script setup lang="ts">
import { useRouter } from "vue-router";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import {
  useTeamInvitation,
  useUser,
  useOnboarding,
  useLoader,
  useNotif,
  useError,
} from "../../../store";
import { AllProductRoute } from "../../../router";
import { getDateString } from "../../../utils";
import TopNavbar from "../../shared/TopNavbar.vue";
import { roleMapper } from "@domain-model";

const router = useRouter();
const teamInvitationStore = useTeamInvitation();
const userStore = useUser();
const onboardingStore = useOnboarding();
const loader = useLoader();
const notif = useNotif();
const errorStore = useError();

async function acceptInvitation(invitationID: string) {
  loader.show();

  const { res, err } = await sf
    .useDefault()
    .POST(`/team/member/invite/accept/${invitationID}`)
    .useHeader(getAuthHeader)
    .runVoid((res) => res.json());

  if (err) {
    loader.hide();
    errorStore.newError(err);
    return;
  }
  if (!res.ok) {
    loader.hide();
    errorStore.newError(new Error(`Failed to accept. ${JSON.stringify(res)}`));
    return;
  }

  await userStore.refreshJWT(true);

  await teamInvitationStore.removeInvitation(invitationID);

  // Force refresh user's onboarding status now that they accepted the invite,
  // so that the route guard will not redirect them to Onboarding view again.
  await onboardingStore.isOnboarding(true);

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

  loader.hide();

  if (err) {
    errorStore.newError(err);
    return;
  }
  if (!res.ok) {
    errorStore.newError(new Error(`Failed to reject. ${JSON.stringify(res)}`));
    return;
  }

  teamInvitationStore.removeInvitation(invitationID);
  notif.setSnackbar("Invitation rejected");
}
</script>

<template>
  <div>
    <TopNavbar back>Pending Invitations</TopNavbar>

    <div class="mx-auto max-w-4xl">
      <div class="mx-6 flex flex-row justify-between pb-6">
        <p class="text-2xl">
          Invitations ({{ teamInvitationStore.invitations.length }})
        </p>

        <button
          class="rounded-lg bg-zinc-100 px-4 text-zinc-900"
          @click="teamInvitationStore.checkForPendingTeamInvitations"
        >
          refresh
        </button>
      </div>

      <div class="mx-6 flex flex-col gap-6">
        <div
          v-for="(invitation, index) in teamInvitationStore.invitations"
          :key="invitation.id"
          class="rounded-lg border border-zinc-300 p-6 text-zinc-900"
        >
          <div class="flex flex-row items-center">
            <p class="pr-3 text-xl">
              {{ index + 1 }}
            </p>

            <div class="flex-grow border-l border-zinc-200 pl-3">
              <p class="mb-2">
                <b>{{ invitation.inviter.name }}</b> invited you to join
                <b>{{ invitation.team.name }}</b> as
                {{ roleMapper[invitation.role] }} on
                {{ getDateString(invitation.createdAt) }}
              </p>

              <hr class="my-4" />

              <div class="flex flex-row space-x-6">
                <button
                  class="rounded-lg border border-zinc-200 p-3"
                  @click="rejectInvitation(invitation.id)"
                >
                  Reject
                </button>
                <button
                  class="w-full rounded-lg border border-green-600 p-2 text-lg text-green-600"
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
