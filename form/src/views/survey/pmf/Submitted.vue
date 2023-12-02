<script setup lang="ts">
import { onUnmounted } from "vue";
import { landingLink } from "../../../utils/links";

const props = defineProps<{ redirect?: string }>();

function getRedirectLink(redirect?: string) {
  try {
    return redirect !== undefined ? new URL(redirect).toString() : null;
  } catch (error) {
    return null;
  }
}

const redirectLink = getRedirectLink(props.redirect);

// NoOp if there is no redirectLink
const timeoutID = setTimeout(
  () => redirectLink !== null && (window.location.href = redirectLink),
  5000
);
onUnmounted(() => clearTimeout(timeoutID));
</script>

<template>
  <div class="mx-auto grid max-w-md p-6">
    <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900">
      Thank You for your response!
    </h1>

    <div v-if="redirectLink !== null" class="pt-12 font-light">
      <p class="pb-8 text-lg">
        Redirecting to
        <a :href="redirectLink" class="italic underline decoration-zinc-400">
          {{ redirectLink }}
        </a>
        in 5 seconds
      </p>

      <a
        :href="redirectLink"
        class="rounded-lg border border-green-600 px-4 py-2 text-lg text-green-600"
      >
        Redirect now
      </a>
    </div>

    <!-- @todo Put a cute art here -->

    <div class="fixed inset-x-0 bottom-12 mx-auto text-center">
      <a
        :href="landingLink"
        target="_blank"
        class="text-xs text-zinc-500 underline"
      >
        All rights reserved. &copy; muwno since 2023
      </a>
    </div>
  </div>
</template>
