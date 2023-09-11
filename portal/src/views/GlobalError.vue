<script setup lang="ts">
import { AllProductRoute } from "../router";

defineProps<{ globalError: Error }>();

defineEmits(["acknowledged"]);
</script>

<template>
  <section class="bg-white">
    <div class="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
      <div class="mx-auto max-w-screen-sm text-center">
        <div class="flex flex-row justify-center">
          <img src="../assets/404.svg" class="max-h-52 md:max-h-96" />
        </div>

        <h1
          class="mb-4 text-7xl font-extrabold tracking-tight text-blue-600 lg:text-9xl"
        >
          whoops
        </h1>

        <p
          class="mb-6 text-2xl font-bold tracking-tight text-gray-900 md:text-4xl"
        >
          This page BROKE!
        </p>

        <p class="mt-11 text-lg font-light text-gray-500">
          Reloading the page might fix it, if not please help us report this
          issue!
        </p>

        <div class="my-6">
          <!-- @todo Add link -->
          <a
            href=""
            class="rounded-lg bg-lime-500 px-6 py-2 text-xl text-white"
          >
            REPORT 💛
          </a>
        </div>

        <div class="my-6 flex flex-row justify-center space-x-6">
          <button
            class="rounded-lg bg-slate-200 px-6 py-2 text-xl text-gray-500"
            @click="$emit('acknowledged')"
          >
            Back
          </button>

          <router-link
            :to="{ name: AllProductRoute.name }"
            class="rounded-lg bg-slate-200 px-6 py-2 text-xl text-gray-500"
          >
            Home
          </router-link>
        </div>

        <div class="text-left">
          <p class="text-2xl font-extrabold">Error Message</p>
          <div
            class="w-full rounded-lg bg-slate-50 p-4 text-red-700 shadow-lg"
            style="word-wrap: break-word"
          >
            {{ globalError }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
