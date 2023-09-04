<script setup lang="ts">
import { ref } from "vue";

const hidden = ref(true);
</script>

<template>
  <div>
    <button
      type="button"
      class="flex w-full items-center justify-between border-b border-gray-200 py-4"
      @click="hidden = !hidden"
    >
      <slot name="summary"></slot>

      <svg
        class="h-3 w-3 shrink-0 transition duration-150"
        :class="{
          'rotate-90': hidden,
          'rotate-180': !hidden,
        }"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5 5 1 1 5"
        />
      </svg>
    </button>

    <div class="px-2 py-4" :class="{ hidden }">
      <slot name="content"></slot>
    </div>
  </div>
</template>
