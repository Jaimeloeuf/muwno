<script setup lang="ts">
/* Build time variables injected in by vite, configured in vite.config.js */

import { getDateTimeString } from "../../utils/date-formatting/getDateTimeString";

const buildTime = getDateTimeString(__vite_inject.buildTime);

// Calculate the version using git branch and commit hash
const version =
  __vite_inject.gitBranch +
  " " +
  __vite_inject.commitHash.slice(0, 6).toString();
</script>

<template>
  <!-- Fixed styles to ensure that the build time string it not too long and extend pass the mobile components -->
  <div style="font-size: 0.7em; max-width: 30em">
    Version: {{ version }}
    <br />
    Build Time: {{ buildTime }}
  </div>
</template>
