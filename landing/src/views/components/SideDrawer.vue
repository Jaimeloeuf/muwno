<script setup lang="ts">
import { useSidedrawer } from "../../store";
import { PricingRoute } from "../../router";
import { loginLink, signupLink } from "../../utils/links";

const drawer = useSidedrawer();
</script>

<template>
  <!-- Overlay across screen to simulate click away from side drawer to close. -->
  <div
    v-if="drawer.showDrawer"
    class="fixed left-0 top-0 z-40 h-screen w-screen"
    @click="drawer.hide"
  ></div>

  <nav
    class="fixed left-0 top-0 z-40 h-screen max-w-md -translate-x-full transition-transform"
    :class="{ 'w-5/6 translate-x-0 shadow-2xl': drawer.showDrawer }"
  >
    <div class="flex h-full flex-col items-start justify-between bg-white p-4">
      <button class="w-full border-b border-zinc-200 py-4" @click="drawer.hide">
        <img src="/logo.svg" />
      </button>

      <div class="w-full pt-2">
        <a
          :href="loginLink"
          target="_blank"
          class="w-full text-xl text-zinc-600"
          @click="drawer.hide"
        >
          <p class="p-2">Login</p>
        </a>

        <hr class="my-2" />

        <a
          :href="signupLink"
          target="_blank"
          class="w-full text-xl text-zinc-600"
          @click="drawer.hide"
        >
          <p class="p-2">Sign up</p>
        </a>

        <hr class="my-2" />

        <router-link
          :to="{ name: PricingRoute.name }"
          class="w-full text-xl text-zinc-600"
          @click="drawer.hide"
        >
          <p class="p-2">Pricing</p>
        </router-link>
      </div>

      <!-- Spacer divider that takes up all the space in the middle -->
      <div class="grow"></div>

      <!-- @todo Create link -->
      <a
        class="flex w-full rounded-lg p-2 text-start text-zinc-800"
        target="_blank"
        @click="drawer.hide"
      >
        <span class="ml-1">Help me!</span>
      </a>
    </div>
  </nav>
</template>
