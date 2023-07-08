<script setup lang="ts">
const MITs = [
  "Allow admins to manage user details",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
  "Allow manual config update",
];
</script>

<template>
  <div class="inline-block w-full rounded-lg bg-slate-50 p-4 shadow">
    <div class="flex flex-row items-center justify-between">
      <p class="text-sm font-semibold">MIT (Most Important Tasks)</p>
      <router-link
        v-if="MITs.length !== 0"
        :to="{}"
        class="rounded-lg bg-lime-500 p-1 px-3 text-sm font-semibold text-gray-50"
      >
        All Details
      </router-link>
    </div>

    <div v-if="MITs.length === 0" class="mt-3 text-2xl font-light">
      This will be automatically generated once there are survey responses.
    </div>

    <div v-else>
      <router-link
        v-for="(MIT, i) in MITs"
        :key="MIT"
        :to="{}"
        class="mt-3 block rounded-lg border border-slate-300 p-2 text-lg font-light hover:bg-white hover:shadow-xl"
      >
        <span class="mr-2">{{ i + 1 }}.</span>
        {{ MIT }}
      </router-link>
    </div>
  </div>
</template>
