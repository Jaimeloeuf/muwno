<script setup lang="ts">
const currentSprintNumber = 12;
</script>

<template>
  <div class="inline-block w-full rounded-lg bg-slate-50 p-4 shadow">
    <p class="text-sm font-medium">Current Sprint</p>

    <div class="text-right">
      <p class="text-4xl font-light">
        {{ currentSprintNumber }}
      </p>
    </div>
  </div>
</template>
