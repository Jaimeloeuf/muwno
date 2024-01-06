<script setup lang="ts">
import { useSlots } from "vue";
import { useNotif, useError } from "../../store";

const notif = useNotif();
const errorStore = useError();

const slots = useSlots();
const props = defineProps<{ textToCopy?: string }>();

/**
 * Write a string to the user's clipboard
 */
async function copy() {
  // Allow user to copy the slot content directly
  // But this requires a runtime check to ensure that either a string is
  // passed in or the slot is defined since it cant be done statically.
  const copyString =
    props.textToCopy !== undefined
      ? props.textToCopy
      : slots.default && slots.default()[0]?.children?.toString();

  if (copyString === undefined || copyString === "") {
    errorStore.newError("RUNTIME ERR: CopyOnClick copyString is empty!");
    return;
  }

  await navigator.clipboard
    .writeText(copyString)
    .then(() => notif.setSnackbar("Copied!"))
    .catch(() => notif.setSnackbar("Failed to copy!"));
}
</script>

<template>
  <span class="cursor-pointer select-none" @click="copy">
    <slot></slot>
  </span>
</template>
