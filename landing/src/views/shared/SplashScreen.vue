<script setup lang="ts">
import { ref } from "vue";

// Simple mechanism to allow user to reload the page if loading state is too
// long or if loader wasnt properly cleared after use pass an 10s (arbitrary).
// This might not be the best thing if multiple loaders are used at once since
// this does not track how many times loader.show() is called.
const longerThanExpected = ref(false);
setTimeout(() => (longerThanExpected.value = true), 3000);

const reloadPage = () => window.location.reload();
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center bg-zinc-50">
    <img src="../../assets/logo.svg" class="pb-8" />

    <img
      class="h-64 w-full pb-12 md:h-80 lg:h-96"
      src="../../assets/hero.svg"
    />

    <div v-if="longerThanExpected" class="text-center">
      <p class="pb-6 text-xl font-medium">
        This is taking longer than usual,<br />do you want to reload and retry?
      </p>

      <button
        class="rounded-lg border border-green-600 px-12 py-1.5 text-lg text-green-600"
        @click="reloadPage"
      >
        Reload
      </button>
    </div>
    <p v-else class="text-2xl font-semibold tracking-wider text-zinc-800">
      ... loading muwno ...
    </p>
  </div>
</template>
