<script setup lang="ts">
const currentSprintNumber = 12;
</script>

<template>
  <div class="inline-block w-fit rounded-lg bg-slate-50 p-4 shadow">
    <p class="text-sm font-medium">Sprint Number</p>

    <div class="text-right">
      <p class="text-4xl font-light">
        {{ currentSprintNumber }}
      </p>
    </div>
  </div>
</template>
