<script setup lang="ts">
import { demoYoutubeLink } from "../../utils/links";
</script>

<template>
  <div class="px-6 md:px-12 lg:px-16 xl:px-24">
    <div class="w-full">
      <p
        class="text-4xl font-extrabold text-zinc-600 md:pb-3 md:text-5xl lg:text-6xl"
      >
        This is how we do it!
      </p>
    </div>

    <div class="aspect-video w-full">
      <iframe
        width="100%"
        height="100%"
        :src="demoYoutubeLink"
        title="muwno demo"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
