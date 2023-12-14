<script setup lang="ts">
import { landingLink } from "../utils/links";

defineProps<{ globalError: Error }>();

const reloadPage = () => window.location.reload();
</script>

<template>
  <div class="mx-auto max-w-screen-sm px-4 py-8 text-center lg:px-6 lg:py-12">
    <div class="flex flex-row justify-center">
      <img src="../assets/404.svg" class="max-h-52 md:max-h-96" />
    </div>

    <h1 class="mb-4 text-7xl font-extrabold text-blue-500 lg:text-8xl">
      whoops
    </h1>

    <p class="mb-6 text-xl font-bold text-zinc-900 md:text-3xl">
      This page broke!
    </p>

    <p class="mb-6 text-lg font-light text-zinc-500">
      Reloading the page might fix it, if not please help us report this issue!
    </p>

    <div
      class="mb-6 flex flex-col-reverse items-center justify-center gap-3 md:flex-row"
    >
      <!-- @todo Add link -->
      <a
        href=""
        class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-xl text-zinc-800"
      >
        Report 💛
      </a>

      <button
        class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-xl text-zinc-800"
        @click="reloadPage"
      >
        Reload
      </button>

      <a
        :href="landingLink"
        class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-xl text-zinc-800"
      >
        Home
      </a>
    </div>

    <div class="text-left">
      <p class="mb-2 text-xl">Error Message</p>
      <div
        class="w-full break-all rounded-lg border border-zinc-200 p-4 text-red-700"
      >
        {{ globalError }}
      </div>
    </div>
  </div>
</template>
