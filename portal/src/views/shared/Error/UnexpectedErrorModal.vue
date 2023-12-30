<script setup lang="ts">
import { reloadPage } from "../../../utils/reloadPage";
import CopyOnClick from "../CopyOnClick.vue";

defineProps<{ error: Error | string }>();
defineEmits<{ (e: "close"): void }>();
</script>

<template>
  <div
    class="flex w-full max-w-screen-md flex-col gap-4 rounded-lg bg-zinc-50 p-12"
  >
    <div class="flex flex-col items-center justify-between gap-8 sm:flex-row">
      <img src="../../../assets/sad-girl.png" class="w-48 sm:-ml-4 sm:w-32" />

      <div class="w-full">
        <p class="text-4xl font-medium">Error</p>
        <p class="font-light">
          Ouch... an error hit us while trying to process your request. Our
          engineers have been scrambled to fight it asap!
        </p>
      </div>
    </div>

    <div class="flex flex-row justify-between gap-6 pb-4">
      <!-- @todo add button to report -->

      <button
        class="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600"
        @click="reloadPage"
      >
        Reload
      </button>

      <button
        class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2"
        @click="$emit('close')"
      >
        Ignore and Continue
      </button>
    </div>

    <div class="flex flex-row items-center justify-between gap-8">
      <img src="../../../assets/sad-lady.png" class="hidden w-32 sm:block" />

      <div class="w-full">
        <p>Details</p>

        <CopyOnClick :textToCopy="error.toString()">
          <div
            class="break-all rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-red-500"
          >
            {{ error }}
          </div>

          <p class="pt-0.5 text-right font-thin">click to copy</p>
        </CopyOnClick>
      </div>
    </div>
  </div>
</template>
