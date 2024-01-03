<script setup lang="ts">
import { ref } from "vue";
import { sf, jsonParser } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase";
import { useOrg, useLoader, useNotif, useError } from "../../../store";
import { prettyJSON } from "../../../utils";
import type { User } from "@domain-model";

const props = defineProps<{ user: User }>();
const emits = defineEmits(["removed"]);

const orgStore = useOrg();
const loader = useLoader();
const notif = useNotif();
const errorStore = useError();

const org = await orgStore.getOrg();

const showConfirmationModal = ref(false);

async function removeUserFromOrg() {
  showConfirmationModal.value = false;

  loader.show("Removing User from Organisation and all their data in it...");

  const { res, err } = await sf
    .useDefault()
    .POST(`/team/member/remove/${props.user.id}`)
    .useHeader(getAuthHeader)
    .runVoid(jsonParser);

  loader.hide();

  if (err) {
    errorStore.newError(err);
    return;
  }
  if (!res.ok) {
    errorStore.newError(
      new Error(`Failed to delete account: ${prettyJSON(res)}`)
    );
    return;
  }

  emits("removed");
  notif.setSnackbar(`Removed ${props.user.name} from ${org.name}`);
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
        <p class="pb-2 text-2xl">
          Remove <b>{{ user.name }}</b> from <b>{{ org.name }}</b>
          ?
        </p>
        <p class="pb-8 text-lg">
          All their data related to this Organisation
          <u>will be permanently deleted and cannot be recovered</u>.
        </p>

        <div class="flex flex-row justify-between gap-6">
          <button
            class="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600"
            @click="removeUserFromOrg"
          >
            Remove
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
      Remove from team
    </button>
  </div>
</template>
