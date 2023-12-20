<script setup lang="ts">
import { ref } from "vue";
import { sf, jsonParser } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useLoader, useNotif, useError } from "../../../store";
import type { TeamInvitation } from "@domain-model";

const props = defineProps<{ invitation: TeamInvitation }>();
const emits = defineEmits(["deleted"]);

const loader = useLoader();
const notif = useNotif();
const errorStore = useError();

const showConfirmationModal = ref(false);

async function deleteInvitation() {
  showConfirmationModal.value = false;

  loader.show("Deleting invitation");

  const { res, err } = await sf
    .useDefault()
    .DEL(`/team/member/invite/${props.invitation.id}`)
    .useHeader(getAuthHeader)
    .runVoid(jsonParser);

  loader.hide();

  if (err) {
    errorStore.newError(err);
    return;
  }
  if (!res.ok) {
    errorStore.newError(
      new Error(`Failed to delete invitation: ${JSON.stringify(res)}`)
    );
    return;
  }

  emits("deleted");
  notif.setSnackbar(`Invitation for ${props.invitation.inviteeEmail} deleted`);
}
</script>

<template>
  <div>
    <div
      v-if="showConfirmationModal"
      class="fixed left-0 top-0 z-30 flex h-screen w-screen flex-col items-center justify-center bg-black bg-opacity-80 p-8"
    >
      <div
        class="flex w-full max-w-screen-sm flex-col rounded-lg bg-zinc-50 p-8 font-light"
      >
        <p class="pb-8 text-2xl">
          Delete pending invitation for <b>{{ invitation.inviteeEmail }}</b> ?
        </p>

        <div class="flex flex-row justify-between gap-6">
          <button
            class="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600"
            @click="deleteInvitation"
          >
            Delete
          </button>

          <button
            class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2"
            @click="showConfirmationModal = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <button
      class="w-full rounded-lg border border-red-200 bg-red-50 p-3 text-left text-red-600"
      @click="showConfirmationModal = true"
    >
      Delete
    </button>
  </div>
</template>
