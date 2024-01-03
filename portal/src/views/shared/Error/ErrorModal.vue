<script setup lang="ts">
import { ref } from "vue";
import { useError } from "../../../store";
import UnexpectedErrorModal from "./UnexpectedErrorModal.vue";
import UserErrorModal from "./UserErrorModal.vue";

const props = defineProps<{ error: Error | string; type: null | "user" }>();
const emit = defineEmits<{ (e: "close"): void }>();

// Log error out as the error modal is shown for more in depth details.
console.error(props.error);

// Use stack value if available to show user more information.
// Even though stack is not a standard, most implementations provide it, so we
// can rely on it if it is available, else use the error value itself.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack
const errorString =
  props.error instanceof Error
    ? props.error.stack !== undefined
      ? props.error.stack
      : props.error.toString()
    : props.error;

const errorStore = useError();
const show = ref(true);

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
    class="fixed left-0 top-0 z-40 flex h-screen w-screen items-center justify-center overflow-y-scroll bg-black bg-opacity-80"
  >
    <template v-if="show">
      <UnexpectedErrorModal
        v-if="type === null"
        :error="errorString"
        @close="ignoreAndCloseModal"
      />
      <UserErrorModal
        v-else-if="type === 'user'"
        :error="errorString"
        @close="ignoreAndCloseModal"
      />
    </template>
  </div>
</template>
