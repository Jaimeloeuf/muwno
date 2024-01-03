<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  AllProductRoute,
  CustomerRoute,
  AccountRoute,
  OrgUsageRoute,
  TeamRoute,
  OrgRoute,
  ApiKeyRoute,
} from "../../router";
import { useOnboarding, useSidedrawer } from "../../store";
import { flags, feedbackLink, logout } from "../../utils";

const route = useRoute();
const onboardingStore = useOnboarding();
const drawer = useSidedrawer();

function closeAndLogout() {
  drawer.hide();
  logout(true);
}
</script>

<template>
  <!-- Overlay across screen to simulate click away from side drawer to close. -->
  <div
    v-if="drawer.showDrawer"
    class="fixed left-0 top-0 z-40 h-screen w-screen bg-black bg-opacity-20"
    @click="drawer.hide"
  ></div>

  <!--
    Conditionally render this when onboarded to prevent users from navigating to
    these routes which will break their experience.
  -->
  <nav
    v-if="onboardingStore.onboarding === false"
    class="fixed left-0 top-0 z-40 h-screen w-48 -translate-x-full transition-transform"
    :class="{ 'translate-x-0 shadow-2xl': drawer.showDrawer }"
  >
    <div
      class="flex h-full w-full flex-col items-start justify-between bg-zinc-50 p-4"
    >
      <button class="w-full border-b border-zinc-200 py-2" @click="drawer.hide">
        <img src="../../assets/logo.svg" class="h-8" />
        <p class="py-1 text-left font-semibold">Public Beta</p>
      </button>

      <div class="w-full pt-3">
        <router-link
          :to="{ name: AllProductRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-300 bg-zinc-100':
              route.name === AllProductRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/Product.svg" class="h-6 w-6" />
          <span class="pl-3">Products</span>
        </router-link>

        <router-link
          v-if="flags.devMode"
          :to="{ name: CustomerRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-300 bg-zinc-100':
              route.name === CustomerRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/Customer.svg" class="h-6 w-6" />
          <span class="pl-3">Customers</span>
        </router-link>

        <div class="my-4 w-full border-b border-zinc-200"></div>

        <router-link
          :to="{ name: OrgUsageRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-300 bg-zinc-100':
              route.name === OrgUsageRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/Usage.svg" class="h-6 w-6" />
          <span class="pl-3">Usage</span>
        </router-link>

        <router-link
          :to="{ name: TeamRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-300 bg-zinc-100': route.name === TeamRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/Team.svg" class="h-6 w-6" />

          <span class="pl-3">Team</span>
        </router-link>

        <router-link
          :to="{ name: OrgRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-300 bg-zinc-100': route.name === OrgRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/Org.svg" class="h-6 w-6" />
          <span class="pl-3">Organisation</span>
        </router-link>

        <router-link
          :to="{ name: ApiKeyRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-300 bg-zinc-100':
              route.name === ApiKeyRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/ApiKey.svg" class="h-6 w-6" />
          <span class="pl-3">API Keys</span>
        </router-link>
      </div>

      <!-- Spacer divider that takes up all the space in the middle -->
      <div class="grow"></div>

      <router-link
        :to="{ name: AccountRoute.name }"
        class="flex w-full rounded-lg p-2 text-start text-zinc-800"
        :class="{
          'border border-zinc-300 bg-zinc-100':
            route.name === AccountRoute.name,
        }"
        @click="drawer.hide"
      >
        <img src="../../assets/SideDrawerIcon/Profile.svg" class="h-6 w-6" />
        <span class="pl-3">Account</span>
      </router-link>

      <!-- <router-link
        :to="{ name: SettingsRoute.name }"
        class="flex w-full rounded-lg p-2 text-start text-zinc-800"
        :class="{
          'border border-zinc-300 bg-zinc-100':
            route.name === SettingsRoute.name,
        }"
        @click="drawer.hide"
      >
        <img src="../../assets/SideDrawerIcon/Settings.svg" class="h-6 w-6" />
        <span class="pl-3">Settings</span>
      </router-link> -->

      <!-- @todo Create link -->
      <a
        class="flex w-full rounded-lg p-2 text-start text-zinc-800"
        target="_blank"
        @click="drawer.hide"
      >
        <img src="../../assets/SideDrawerIcon/Help.svg" class="h-6 w-6" />
        <span class="pl-3">Help me!</span>
      </a>

      <a
        :href="feedbackLink"
        target="_blank"
        class="flex w-full rounded-lg p-2 text-start text-zinc-900"
      >
        <img
          src="../../assets/SideDrawerIcon/Feedback.svg"
          class="h-5 w-5 pl-0.5"
        />
        <span class="ml-4 flex-1">Feedback</span>
      </a>

      <button
        class="flex w-full p-2 text-start text-zinc-800"
        @click="closeAndLogout"
      >
        <img src="../../assets/SideDrawerIcon/logout.svg" class="h-6 w-6" />
        <span class="pl-3">Logout</span>
      </button>
    </div>
  </nav>
</template>
