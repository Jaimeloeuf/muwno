<script setup lang="ts">
import { loginLink, signupLink } from "../../utils/links";
import { useSidedrawer } from "../../store";

const drawer = useSidedrawer();
</script>

<template>
  <header class="fixed top-0 z-30 w-full bg-white shadow-sm">
    <div class="flex flex-row items-center justify-between px-8 py-6 lg:px-20">
      <img src="/logo.svg" class="sm:w-52" />

      <div class="flex flex-row items-center gap-6">
        <div class="hidden flex-row gap-6 md:flex">
          <a
            :href="loginLink"
            target="_blank"
            class="rounded-full bg-primary px-6 py-2 font-semibold text-white"
          >
            Login
          </a>

          <a
            :href="signupLink"
            target="_blank"
            class="rounded-full border-2 border-primary px-6 py-2 font-semibold text-zinc-600"
          >
            Sign up
          </a>
        </div>

        <button
          type="button"
          class="inline-flex rounded-lg pb-1 sm:pb-0"
          @click="drawer.show"
        >
          <svg
            class="h-8 w-8"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>

  <div class="py-12 md:py-20 lg:py-24"></div>
</template>
