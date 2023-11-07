<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ (e: "close"): void }>();
const props = defineProps<{ msg: string; timeout: number }>();

const numberOfLoops = props.timeout / 10;
const stepPerLoop = 100 / numberOfLoops;

const progressBarProgress = ref(0);

const progressBarInterval = setInterval(() => {
  if (progressBarProgress.value >= 99) clearInterval(progressBarInterval);
  progressBarProgress.value += stepPerLoop;
}, 10);

const show = ref(true);

/**
 * On notification completed, stop showing the snackbar first and do a delay
 * before emitting the `close` event.
 */
async function completed() {
  show.value = false;

  // Add a delay before showing another notif for the animation of it going down
  // and up again to visually indicate there is a new notif.
  await new Promise((res) => setTimeout(res, 400));

  emit("close");
}

setTimeout(completed, props.timeout);
</script>

<template>
  <div v-if="show" class="fixed bottom-4 right-0 pr-4">
    <div
      class="w-full max-w-xl rounded-lg border border-zinc-200 bg-zinc-50 shadow-2xl drop-shadow-2xl sm:min-w-[24rem]"
    >
      <div class="flex flex-row justify-between p-4">
        <p class="pr-6">{{ msg }}</p>
        <button
          type="button"
          class="whitespace-nowrap font-medium text-zinc-700 underline"
          @click="completed"
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
