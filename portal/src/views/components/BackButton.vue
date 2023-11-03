<script setup lang="ts">
import { useRouter } from "vue-router";
import type { RouteName } from "../../router";

const props = defineProps<{
  /**
   * Custom back route can be specified instead of just going back one step in
   * navigation history.
   */
  routeName?: RouteName | undefined;
}>();

const router = useRouter();

const back = () => {
  props.routeName === undefined
    ? router.back()
    : router.push({ name: props.routeName });
};
</script>

<template>
  <button class="rounded-lg bg-zinc-100 px-4 py-1.5" @click="back">
    <svg
      class="inline-block h-6 w-6 rotate-180 text-zinc-600"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 7"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M1 5h12m0 0L9 1m4 4L9 9"
      />
    </svg>
  </button>
</template>
