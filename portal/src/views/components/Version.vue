<script setup lang="ts">
/* Build time variables injected in by vite, configured in vite.config.js */

import { getDateTimeString } from "../../utils/date-formatting/getDateTimeString";

const buildTime = getDateTimeString(__vite_inject.buildTime);

// Version is git branch and commit hash
const version =
  __vite_inject.gitBranch +
  " " +
  __vite_inject.commitHash.slice(0, 6).toString();
</script>

<template>
  <div class="max-w-lg text-xs font-extralight">
    Version: {{ version }}
    <br />
    Build Time: {{ buildTime }}
  </div>
</template>
