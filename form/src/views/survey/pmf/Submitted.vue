<script setup lang="ts">
import { landingLink } from "../../../utils/links";
</script>

<template>
  <div class="m-6 grid max-w-md">
    <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900">
      Thank You for your response!
    </h1>

    <!-- @todo Put a cute art here -->

    <div class="fixed inset-x-0 bottom-12 mx-auto text-center">
      <a
        :href="landingLink"
        target="_blank"
        class="text-xs text-zinc-500 underline"
      >
        All rights reserved. &copy; muwno since 2023
      </a>
    </div>
  </div>
</template>
