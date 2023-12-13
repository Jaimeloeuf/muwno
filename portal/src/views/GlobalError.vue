<script setup lang="ts">
import { useRouter } from "vue-router";
import { AllProductRoute } from "../router";
import CopyOnClick from "./shared/CopyOnClick.vue";

defineProps<{ globalError: Error }>();

defineEmits(["acknowledged"]);

const router = useRouter();
</script>

<template>
  <div class="mx-auto max-w-screen-sm px-4 py-8 text-center lg:px-6 lg:py-12">
    <div class="flex flex-row justify-center">
      <img src="../assets/404.svg" class="max-h-52 md:max-h-96" />
    </div>

    <h1 class="mb-4 text-7xl font-extrabold text-blue-600 lg:text-8xl">
      whoops
    </h1>

    <p class="mb-6 text-xl font-bold text-zinc-900 md:text-3xl">
      This page broke!
    </p>

    <p class="mb-6 text-lg font-light text-zinc-500">
      Reloading the page might fix it, if not please help us report this issue!
    </p>

    <div class="mb-6 flex flex-row items-center justify-center gap-3">
      <!-- @todo Add link -->
      <a
        href=""
        class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-xl text-zinc-800"
      >
        Report 💛
      </a>

      <button
        class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-xl text-zinc-800"
        @click="router.back(), $emit('acknowledged')"
      >
        Back
      </button>

      <router-link
        :to="{ name: AllProductRoute.name }"
        class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-xl text-zinc-800"
        @click="$emit('acknowledged')"
      >
        Home
      </router-link>
    </div>

    <div class="text-left">
      <p class="pb-1">Details</p>
      <CopyOnClick :textToCopy="globalError.toString()">
        <div
          class="w-full break-all rounded-lg border border-zinc-200 p-4 text-red-700"
        >
          {{ globalError }}
        </div>

        <p class="pt-0.5 text-right font-thin">click to copy</p>
      </CopyOnClick>
    </div>
  </div>
</template>
