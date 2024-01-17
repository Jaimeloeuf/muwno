<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ (e: "close"): void }>();
const props = defineProps<{ msg: string; timeout: number }>();

const numberOfLoops = props.timeout / 10;
const stepPerLoop = 100 / numberOfLoops;

const progressBarProgress = ref(0);
const show = ref(true);
const hover = ref(false);

/**
 * On notification completed, stop showing the snackbar first and do a delay
 * before emitting the `close` event.
 */
async function completed() {
  show.value = false;
  hover.value = false;

  // Add a delay before showing another notif for the animation of it going down
  // and up again to visually indicate there is a new notif.
  await new Promise((res) => setTimeout(res, 400));

  emit("close");
}

async function countdown() {
  while (progressBarProgress.value <= 100) {
    // Stop the countdown function entirely once user hovers over the snackbar.
    if (hover.value) return;
    progressBarProgress.value += stepPerLoop;
    await new Promise((res) => setTimeout(res, 10));
  }
  // Call the completed function once the countdown has completed.
  completed();
}

/**
 * When user stop hovering, update hover tracking variable and call countdown
 * function to continue the countdown
 */
function mouseleave() {
  hover.value = false;
  countdown();
}

// Start countdown at the end of the setup function
countdown();
</script>

<template>
  <div
    v-if="show"
    class="w-full max-w-xl rounded-lg border border-zinc-200 bg-zinc-50 shadow-2xl drop-shadow-2xl sm:min-w-[24rem]"
    @mouseenter="hover = true"
    @mouseleave="mouseleave"
  >
    <div class="flex flex-row items-center justify-between p-4">
      <p class="pr-6">{{ msg }}</p>
      <button
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white px-2 py-1 text-zinc-400 shadow"
        @click="completed"
      >
        <svg
          class="h-3 w-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>

    <div class="h-1 w-full rounded-b-lg bg-zinc-300">
      <div
        class="h-1 rounded-bl-lg bg-zinc-500 transition-all duration-0"
        :style="{ width: `${progressBarProgress}%` }"
      ></div>
    </div>
  </div>
</template>
