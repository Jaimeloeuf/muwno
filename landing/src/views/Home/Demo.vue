<script setup lang="ts">
import { ref } from "vue";
import { demoYoutubeLink } from "../../utils/links";

const showVideoModal = ref(false);
</script>

<template>
  <div class="px-6 md:px-12 lg:px-16 xl:px-24">
    <div
      class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-12"
    >
      <div class="flex w-full flex-col gap-4 self-stretch lg:gap-12">
        <p
          class="pt-1 text-2xl font-medium text-zinc-800 md:text-3xl lg:text-4xl xl:text-5xl"
        >
          Everything you need to know in
          <span class="text-primary">one dashboard</span>
        </p>

        <p class="text-zinc-800 lg:text-lg xl:text-xl">
          Stop wasting time hacking together Google Form, CSV files, Email
          automations and Tableau / Power BI ... just to understand what your
          customers want.
          <br />
          <br class="hidden lg:block" />
          Let us do the hard work so you can spend more time on things that
          actually move your business forward.
        </p>
      </div>

      <div class="relative w-full">
        <button @click="showVideoModal = true">
          <div
            class="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 transform"
          >
            <div
              class="flex flex-row items-center justify-center rounded-full border-4 border-primary bg-white px-4 py-2 text-primary"
            >
              <svg
                class="h-5 pr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M3 22v-20l18 10-18 10z" />
              </svg>
              <p class="text-xl">SEE DEMO</p>
            </div>
          </div>

          <img src="../../assets/demo vid ss.png" draggable="false" />
        </button>
      </div>
    </div>

    <!-- @todo If mobile view, open youtube link in new tab as the modal is too small -->
    <div
      v-if="showVideoModal"
      class="fixed left-0 top-0 z-40 flex h-screen w-screen cursor-pointer flex-col justify-center bg-black bg-opacity-80 p-4 sm:p-8 lg:p-16 xl:p-32"
      @click="showVideoModal = false"
    >
      <button
        class="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-2 text-zinc-600"
      >
        <svg
          class="h-8 w-8"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>

      <div class="aspect-video w-full">
        <!--
          Add query param to always autoplay the video if possible.
          Note that this does not work on safari as safari prevents autoplay
          unless user explicitly allows it or their ML deems it user preferred.
          https://developer.apple.com/forums/thread/90784
        -->
        <iframe
          width="100%"
          height="100%"
          :src="`${demoYoutubeLink}&autoplay=1`"
          title="muwno demo"
          frameborder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture;"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>
