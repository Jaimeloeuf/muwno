<script setup lang="ts">
import { ref } from "vue";
import { useError } from "../../store";

const props = defineProps<{ error: Error }>();
const emit = defineEmits<{ (e: "close"): void }>();

// Log error out as the error modal is shown for more in depth details.
console.error(props.error);

const errorStore = useError();
const show = ref(true);

const reloadPage = () => window.location.reload();

/**
 * If this is not the only error in errorStore, stop showing modal's error box
 * first and do a delay before emitting the `close` event. The hide and show
 * animation is used to visually indicate there is another error.
 */
async function ignoreAndCloseModal() {
  // If there is more than 1 error in errorStore, do the animation for replacing
  // with the next error to display.
  if (errorStore.errors.length > 1) {
    show.value = false;
    await new Promise((res) => setTimeout(res, 200));
  }

  emit("close");
}
</script>

<template>
  <div
    class="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-80"
  >
    <div
      v-if="show"
      class="flex max-w-screen-md flex-col gap-4 rounded-lg bg-zinc-50 p-12"
    >
      <div class="flex flex-col items-center justify-between gap-8 sm:flex-row">
        <img src="../../assets/sad-girl.png" class="w-48 sm:-ml-4 sm:w-32" />

        <div class="w-full">
          <p class="text-4xl font-medium">Error</p>
          <p class="text">
            An error attacked us when trying to process your request...
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
          @click="ignoreAndCloseModal"
        >
          Ignore and Continue
        </button>
      </div>

      <div class="flex flex-row items-center justify-between gap-8">
        <img src="../../assets/sad-lady.png" class="hidden w-32 sm:block" />

        <div class="w-full">
          <p>Details</p>
          <!-- @todo get rid of the custom css -->
          <div
            class="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-red-500"
            style="word-wrap: break-word"
          >
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
