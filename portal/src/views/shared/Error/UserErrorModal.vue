<script setup lang="ts">
import { reloadPage } from "../../../utils";
import CopyOnClick from "../CopyOnClick.vue";

defineProps<{ error: string }>();
defineEmits<{ (e: "close"): void }>();
</script>

<template>
  <div
    class="flex w-full max-w-screen-md flex-col gap-4 rounded-lg bg-zinc-50 p-12"
  >
    <div class="flex flex-col items-center justify-between gap-8 sm:flex-row">
      <img src="../../../assets/sad-lady.png" class="w-32" />

      <div class="w-full">
        <p class="pb-4 text-2xl font-medium sm:pb-8 sm:text-4xl">
          Hey! That didn't work...
        </p>
        <p>Details <span class="pl-1 text-xs">(scroll for more)</span></p>

        <CopyOnClick :textToCopy="error">
          <div class="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <pre
              class="max-h-16 overflow-y-scroll whitespace-pre-wrap break-all text-sm text-red-500 sm:max-h-96"
              >{{ error }}</pre
            >
          </div>

          <p class="pt-0.5 text-right font-thin">click to copy</p>
        </CopyOnClick>
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
        Ok, I got it!
      </button>
    </div>
  </div>
</template>
