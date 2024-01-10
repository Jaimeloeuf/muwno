<template>
  <div>
    <!-- @todo Not sure why .value here errors out even though it is fine with loader.vue -->

    <!-- Overlay across screen to simulate click away from side drawer to close. -->
    <div
      v-if="sideDrawer.showDrawer.value"
      class="fixed left-0 top-0 z-40 h-screen w-screen"
      @click="sideDrawer.hide"
    ></div>

    <nav
      class="fixed left-0 top-0 z-40 h-screen max-w-md -translate-x-full transition-transform"
      :class="{
        'w-5/6 translate-x-0 shadow-2xl': sideDrawer.showDrawer.value,
      }"
    >
      <div class="flex h-full flex-col items-start bg-white p-4">
        <NuxtLink
          to="/"
          class="w-full border-b border-zinc-200 py-4"
          @click.native="sideDrawer.hide"
        >
          <img src="../assets/logo.svg" />
        </NuxtLink>

        <div class="w-full pt-2">
          <div class="py-2"></div>

          <a
            :href="signupLink"
            target="_blank"
            class="flex w-full flex-row items-center justify-between gap-2 rounded-lg border border-primary px-4 py-2.5"
            @click.native="sideDrawer.hide"
          >
            <a class="tracking-wide text-primary">SIGN UP</a>

            <svg
              class="h-3 w-3 shrink-0 rotate-90 text-primary"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </a>

          <hr class="mb-4 mt-6" />

          <a
            :href="loginLink"
            target="_blank"
            class="tracking-wide text-zinc-600"
            @click.native="sideDrawer.hide"
          >
            <p class="px-2">SIGN IN</p>
          </a>

          <hr class="my-4" />

          <NuxtLink
            to="/pricing"
            class="tracking-wide text-zinc-600"
            @click.native="sideDrawer.hide"
          >
            <p class="px-2">PRICING</p>
          </NuxtLink>

          <hr class="my-4" />

          <NuxtLink
            to="/contact"
            class="tracking-wide text-zinc-600"
            @click.native="sideDrawer.hide"
          >
            <p class="px-2">CONTACT US</p>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>
