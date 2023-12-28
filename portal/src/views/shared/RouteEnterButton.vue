<script setup lang="ts">
import EnterButton from "./EnterButton.vue";
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  /**
   * Pass through for the router-link component's `to` prop.
   */
  to: RouteLocationRaw;
}>();
</script>

<template>
  <router-link :to="to">
    <EnterButton>
      <slot></slot>
    </EnterButton>
  </router-link>
</template>
