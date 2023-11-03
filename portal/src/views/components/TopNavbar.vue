<script setup lang="ts">
import SideDrawerButton from "./SideDrawerButton.vue";
import BackButton from "./BackButton.vue";
import type { RouteName } from "../../router";

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
  backRoute?: RouteName;
}>();
</script>

<template>
  <header
    class="fixed top-0 z-30 flex w-full flex-row items-center border-b bg-white py-3"
  >
    <SideDrawerButton v-if="sideDrawer" class="mr-3 pb-0.5" />
    <BackButton v-if="back" :routeName="backRoute" class="mr-3" />
    <span class="text-2xl font-light">
      <slot></slot>
    </span>
  </header>

  <!-- Spacer to allow scroll pass instead of covering content with navbar -->
  <div class="py-8"></div>
</template>
