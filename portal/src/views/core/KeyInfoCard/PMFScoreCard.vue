<script setup lang="ts">
const score = 42;
// const score = 39;
</script>

<template>
  <div class="inline-block w-fit rounded-lg bg-slate-50 p-4 shadow">
    <p class="text-sm font-medium">Current score</p>

    <div class="text-right">
      <p class="text-4xl">
        <span
          :class="{
            'text-lime-700': score >= 40,
            'text-red-700': score < 40,
          }"
        >
          {{ score }}
        </span>
        <span class="font-extralight">/40</span>
      </p>

      <!-- @todo Add Up / Down arrows to show trend if you improved this week or got worse -->
    </div>
  </div>
</template>
