<script setup lang="ts">
import { useNotif } from "../../../store/notif.store";
import SnackbarCard from "./Card.vue";

const notif = useNotif();
</script>

<template>
  <div
    v-if="notif.snackBarMessages.length > 0"
    class="fixed bottom-4 right-0 z-50 pr-4"
  >
    <div
      v-for="{ id, msg, timeout } in notif.snackBarMessages"
      :key="id"
      class="pt-2"
    >
      <SnackbarCard
        :msg="msg"
        :timeout="timeout"
        @close="notif.removeMessage(id)"
      />
    </div>
  </div>
</template>
