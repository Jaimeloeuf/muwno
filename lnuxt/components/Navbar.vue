<template>
  <div>
    <header class="fixed top-0 z-30 w-full bg-white shadow-sm">
      <div
        class="flex flex-row items-center justify-between px-6 py-2 md:px-12 lg:px-16 xl:px-24"
      >
        <NuxtLink to="/">
          <img src="../assets/logo.svg" class="w-28" />
        </NuxtLink>

        <div class="w-max">
          <div class="hidden flex-row items-center gap-8 pr-4 text-sm md:flex">
            <NuxtLink
              to="/pricing"
              class="tracking-wide text-zinc-700 hover:text-primary hover:underline hover:decoration-primary hover:underline-offset-4"
            >
              PRICING
            </NuxtLink>

            <NuxtLink
              to="/contact"
              class="tracking-wide text-zinc-700 hover:text-primary hover:underline hover:decoration-primary hover:underline-offset-4"
            >
              CONTACT US
            </NuxtLink>

            <a
              :href="loginLink"
              target="_blank"
              class="tracking-wide text-zinc-700 hover:text-primary hover:underline hover:decoration-primary hover:underline-offset-4"
            >
              SIGN IN
            </a>

            <a
              :href="signupLink"
              target="_blank"
              class="rounded-full bg-primary px-6 py-2 tracking-wide text-white hover:shadow-2xl hover:brightness-90"
            >
              SIGN UP
            </a>
          </div>

          <button
            type="button"
            class="inline-flex rounded-lg pb-1 sm:pb-0 md:hidden"
            @click="sideDrawer.show"
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

    <div class="py-6"></div>
  </div>
</template>
