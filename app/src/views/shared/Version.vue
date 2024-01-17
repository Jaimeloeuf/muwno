<script setup lang="ts">
/* Build time variables injected in by vite, configured in vite.config.js */

import { getDateTimeString } from "../../utils";

const buildTime = getDateTimeString(__vite_inject.buildTime);
const version = __vite_inject.version;
</script>

<template>
  <p class="break-all text-xs font-extralight">
    Version: {{ version }}
    <br />
    Build Time: {{ buildTime }}
  </p>
</template>
