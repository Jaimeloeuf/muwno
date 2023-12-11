<script setup lang="ts">
import { ref } from "vue";
import { useError, useLoader, useNotif } from "../../../../store";
import { manualEmailBlast } from "../../../../controller";
import { surveyBlastEmailBuilder } from "../../../../../../server/src/utils/email-builders/surveyBlastEmailBuilder";
import type { Product } from "@domain-model";

const props = defineProps<{
  product: Product;
  surveyLink: string;
  redirectLink: string;
  isRedirectLinkValid: boolean;
}>();

const errorStore = useError();
const loader = useLoader();
const notif = useNotif();

const testEmail = ref("");
const testName = ref("");

function resetTestValues() {
  testEmail.value = "";
  testName.value = "";
}

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
  <div class="w-full max-w-screen-lg rounded-lg border border-zinc-200 p-3">
    <div class="pb-8">
      <p class="text-2xl">Preview</p>
      <ul class="list-decimal px-5 pb-4 font-light">
        <li>This is how the email sent to your customers will look like.</li>
        <li>
          The values surrounded in brackets like
          <code>{{ "\{\{ VALUE \}\}" }}</code> will be dynamically replaced with
          the values in the CSV file you uploaded.
        </li>
        <li>
          If <code>{{ "\{\{ CUSTOMER_NAME \}\}" }}</code> is not specified as it
          is optional, it will default to 'there'.
        </li>
        <li>
          Try sending out a test email to yourself, you will see the sample
          values get updated.
        </li>
      </ul>

      <div class="pb-4">
        <p class="text-sm">
          From (If you want to customise this, email
          <a
            href="mailto:help@muwno.com"
            class="italic underline decoration-zinc-400"
            >help@muwno.com</a
          >)
        </p>
        <!-- @todo Load this from somewhere? possibly an API call? -->
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          survey-blasts@muwno.com
        </p>
      </div>

      <div class="pb-4">
        <p class="text-sm">To</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{ testEmail === "" ? "\{\{ CUSTOMER_EMAIL \}\}" : testEmail }}
        </p>
      </div>

      <div class="pb-4">
        <p class="text-sm">Subject</p>
        <p class="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
          {{
            surveyBlastEmailBuilder.subject(
              testName === "" ? "\{\{ CUSTOMER_NAME \}\}" : testName,
              product.name
            )
          }}
        </p>
      </div>

      <div>
        <p class="text-sm">Message</p>
        <!-- @todo Temporarily disabling eslint rule to render raw HTML -->
        <!-- eslint-disable vue/no-v-html -->
        <p
          class="break-all rounded-lg border border-zinc-200 bg-zinc-50 p-2"
          v-html="
            surveyBlastEmailBuilder.body(
              testName === '' ? '\{\{ CUSTOMER_NAME \}\}' : testName,
              product.name,
              surveyLink
            )
          "
        ></p>
      </div>
    </div>

    <div>
      <p class="pb-2 text-2xl">Send yourself a test email</p>

      <div class="flex flex-col gap-4 pb-4 md:flex-row">
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
      </div>

      <div class="flex flex-row items-center justify-between gap-4">
        <button
          class="rounded-lg border border-zinc-200 px-4 py-1"
          @click="resetTestValues"
        >
          reset
        </button>
        <button
          class="w-full rounded-lg border p-1"
          :class="{ 'border-green-600 text-green-600': testEmail !== '' }"
          :disabled="testEmail === ''"
          @click="sendTestEmail"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>
