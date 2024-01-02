<script setup lang="ts">
import { landingLink } from "../../../utils/links";
</script>

<template>
  <!-- -m-6 is used to cancel out the p-6 class set on App.vue's root component -->
  <div class="-m-6 flex flex-row justify-between">
    <div
      class="hidden h-screen w-full max-w-xs bg-gradient-to-tr from-zinc-950 from-5% to-sky-900 to-95% md:flex md:flex-col md:justify-center md:px-8 lg:max-w-md xl:max-w-lg xl:px-12"
    >
      <div class="text-white">
        <a :href="landingLink" target="_blank">
          <img src="../../../assets/logo.svg" alt="logo" class="h-12" />
        </a>

        <p class="pb-8 text-xl font-bold text-zinc-200">Earn More</p>

        <p class="text-xl tracking-wide text-zinc-200 lg:text-2xl">
          Customer Feedback<br />
          collection and analysis<br />
          to grow your business.
        </p>
      </div>
    </div>

    <div
      class="flex h-screen w-full flex-col justify-center bg-white bg-cover bg-center px-8 md:bg-[url(../assets/auth_bg.avif)]"
    >
      <div class="mx-auto w-full max-w-sm">
        <a :href="landingLink" target="_blank" class="w-max md:hidden">
          <img src="../../../assets/logo.svg" alt="logo" />
        </a>

        <div
          class="rounded-2xl bg-white py-4 md:border md:border-zinc-100 md:px-8 md:py-12 md:shadow-2xl md:shadow-zinc-500"
        >
          <slot></slot>
        </div>

        <div
          class="pt-4 text-[0.6rem] font-thin md:absolute md:bottom-4 md:pt-0 md:text-white"
        >
          By using our product, you agree to our
          <a :href="`${landingLink}/PP.pdf`" target="_blank" class="underline">
            Privacy Policy
          </a>
          and
          <a :href="`${landingLink}/TC.pdf`" target="_blank" class="underline"
            >Terms & Conditions</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
