<script setup lang="ts">
import { ref } from "vue";
import { useNotif } from "../../store";

const notif = useNotif();

const numberOfLoops = notif._timeoutInMilliSeconds / 10;
const stepPerLoop = 100 / numberOfLoops;

const progressBarProgress = ref(0);

const progressBarInterval = setInterval(() => {
  if (progressBarProgress.value >= 99) clearInterval(progressBarInterval);
  progressBarProgress.value += stepPerLoop;
}, 10);
</script>

<template>
  <div class="fixed bottom-4 right-0 pr-4">
    <div
      class="w-full max-w-lg rounded-lg border border-slate-300 bg-white shadow-2xl drop-shadow-2xl"
    >
      <div class="flex flex-row justify-between p-4">
        <p class="pr-6">{{ notif.snackBarMessage }}</p>
        <button
          type="button"
          class="whitespace-nowrap font-medium text-gray-700 underline"
          @click="notif.hideSnackbar"
        >
          Got it
        </button>
      </div>

      <div class="h-1 w-full rounded-b-lg bg-gray-300">
        <div
          class="h-1 rounded-bl-lg bg-gray-500 transition-all duration-0"
          :style="{ width: `${progressBarProgress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>
