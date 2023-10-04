<script setup lang="ts">
import { ref } from "vue";
import { useNotif } from "../../store";

const notifStore = useNotif();

const notif = notifStore.snackBarMessages[0] ?? { msg: "", timeout: 0 };

const numberOfLoops = notif.timeout / 10;
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
      class="w-full max-w-xl rounded-lg border border-zinc-200 bg-zinc-50 shadow-2xl drop-shadow-2xl sm:min-w-[24rem]"
    >
      <div class="flex flex-row justify-between p-4">
        <p class="pr-6">{{ notif.msg }}</p>
        <button
          type="button"
          class="whitespace-nowrap font-medium text-zinc-700 underline"
          @click="notifStore.hideSnackbar"
        >
          Got it
        </button>
      </div>

      <div class="h-1 w-full rounded-b-lg bg-zinc-300">
        <div
          class="h-1 rounded-bl-lg bg-zinc-500 transition-all duration-0"
          :style="{ width: `${progressBarProgress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>
