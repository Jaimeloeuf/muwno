<script setup lang="ts">
import { ref } from "vue";
import { surveyBlastEmailBuilder } from "../../../../../../server/src/utils/email-builders/surveyBlastEmailBuilder";
import type { Product } from "@domain-model";

defineProps<{
  product: Product;
  surveyLink: string;
  redirectLink: string;
  isRedirectLinkValid: boolean;
}>();

const testEmail = ref("");
const testName = ref("");
</script>

<template>
  <div class="w-full max-w-screen-lg rounded-lg border border-zinc-200 p-3">
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
      <p class="rounded-lg border border-zinc-200 p-2">
        survey-blasts@muwno.com
      </p>
    </div>

    <div class="pb-4">
      <p class="text-sm">To</p>
      <p class="rounded-lg border border-zinc-200 p-2">
        {{ testEmail === "" ? "\{\{ CUSTOMER_EMAIL \}\}" : testEmail }}
      </p>
    </div>

    <div class="pb-4">
      <p class="text-sm">Subject</p>
      <p class="rounded-lg border border-zinc-200 p-2">
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
        class="break-all rounded-lg border border-zinc-200 p-2"
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
</template>
