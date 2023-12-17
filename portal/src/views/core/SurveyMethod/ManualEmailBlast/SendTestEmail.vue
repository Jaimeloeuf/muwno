<script setup lang="ts">
import { ref } from "vue";
import { useError, useLoader, useNotif } from "../../../../store";
import { manualEmailBlast } from "../../../../controller";
import type { Product } from "@domain-model";

const props = defineProps<{
  product: Product;
  redirectLink: string;
  isRedirectLinkValid: boolean;
}>();

const errorStore = useError();
const loader = useLoader();
const notif = useNotif();

const testEmail = ref("");
const testName = ref("");

async function sendTestEmail() {
  loader.show(`Sending test email to ${testEmail.value}`);

  const result = await manualEmailBlast(
    props.product.id,
    [
      {
        // Defaults to null as expected by the API for it to use default name.
        name: testName.value !== "" ? testName.value : null,
        email: testEmail.value,
      },
    ],
    props.isRedirectLinkValid ? props.redirectLink : null
  );

  if (result instanceof Error) {
    errorStore.newError(result);
  } else {
    notif.setSnackbar(`Test email sent to ${testEmail.value}`);
  }

  loader.hide();
}
</script>

<template>
  <div class="rounded-lg border border-zinc-200 p-2">
    <div class="flex flex-col gap-4 md:flex-row md:items-end">
      <div class="w-full">
        <p class="text-sm">Email</p>
        <input
          v-model.trim="testEmail"
          type="text"
          class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
          placeholder="E.g. janedoe@gmail.com"
        />
      </div>

      <div class="w-full">
        <p class="text-sm">Optional Name</p>
        <input
          v-model.trim="testName"
          type="text"
          class="w-full rounded-lg border border-zinc-200 p-2 focus:outline-none"
          placeholder="E.g. Jane Doe"
        />
      </div>

      <button
        class="w-full rounded-lg border p-2 md:w-max"
        :class="{ 'border-green-600 text-green-600': testEmail !== '' }"
        :disabled="testEmail === ''"
        @click="sendTestEmail"
      >
        Send
      </button>
    </div>
  </div>
</template>
