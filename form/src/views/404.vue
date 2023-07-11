<script setup lang="ts">
import { HomeRoute } from "../router";
</script>

<template>
  <section class="bg-white">
    <div class="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
      <div class="mx-auto max-w-screen-sm text-center">
        <img src="../assets/404.svg" />

        <h1
          class="mb-4 text-7xl font-extrabold tracking-tight text-blue-600 lg:text-9xl"
        >
          404
        </h1>

        <p
          class="mb-6 text-2xl font-bold tracking-tight text-gray-900 md:text-4xl"
        >
          Whoops! This page doesn't exist.
        </p>

        <p class="mt-11 text-lg font-light text-gray-500">
          Here are some helpful links instead:
        </p>

        <router-link
          :to="{ name: HomeRoute.name }"
          class="my-4 inline-flex text-center font-medium text-gray-500 underline"
        >
          Home
        </router-link>
      </div>
    </div>
  </section>
</template>
