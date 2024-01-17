<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";
import SideDrawerButton from "./SideDrawerButton.vue";
import BackButton from "./BackButton.vue";

defineProps<{
  /**
   * Show side drawer button?
   */
  sideDrawer?: boolean;

  /**
   * Show back button?
   */
  back?: boolean;

  /**
   * Custom back route can be specified which will be passed to the `BackButton`
   * component.
   */
  backRoute?: RouteLocationRaw;
}>();
</script>

<template>
  <header
    class="fixed top-0 z-30 flex w-full flex-row items-center border-b bg-white pb-2 pt-3"
  >
    <SideDrawerButton v-if="sideDrawer" class="mr-2" />
    <BackButton v-if="back" :to="backRoute" class="mr-3" />
    <span class="text-xl font-light">
      <slot></slot>
    </span>
  </header>

  <!-- Spacer to allow scroll pass instead of covering content with navbar -->
  <div class="py-6"></div>
</template>
