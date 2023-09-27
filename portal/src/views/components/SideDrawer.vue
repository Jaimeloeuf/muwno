<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  AllProductRoute,
  CustomerRoute,
  ManageSubscriptionRoute,
  ProfileRoute,
  OrgUsageRoute,
  TeamRoute,
  ApiKeyRoute,
} from "../../router";
import { useOnboarding, useSidedrawer } from "../../store";
import { logout } from "../../utils/logout";

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
    class="fixed left-0 top-0 z-40 h-screen w-screen"
    @click="drawer.hide"
  ></div>

  <!--
    Conditionally render this when onboarded to prevent users from navigating to
    these routes which will break their experience.
  -->
  <nav
    v-if="onboardingStore.onboarding === false"
    class="fixed left-0 top-0 z-40 h-screen max-w-xs -translate-x-full transition-transform"
    :class="{ 'w-5/6 translate-x-0 shadow-2xl': drawer.showDrawer }"
  >
    <div class="flex h-full flex-col items-start justify-between bg-white p-4">
      <button class="w-full border-b border-zinc-200 py-4" @click="drawer.hide">
        <span class="text-2xl">Product Market Fit</span>
        <span class="ml-3 text-2xl">📈</span>
      </button>

      <div class="w-full pt-2">
        <router-link
          :to="{ name: AllProductRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-200 bg-zinc-50':
              route.name === AllProductRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/Product.svg" class="h-6 w-6" />
          <span class="ml-3 flex-1 text-left">Products</span>
        </router-link>

        <router-link
          :to="{ name: CustomerRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-200 bg-zinc-50':
              route.name === CustomerRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/Customer.svg" class="h-6 w-6" />
          <span class="ml-3 flex-1 text-left">Customers</span>
        </router-link>

        <p
          class="mb-2 mt-6 w-full border-b border-zinc-200 pb-1 text-center font-extralight"
        >
          More
        </p>

        <router-link
          :to="{ name: OrgUsageRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-200 bg-zinc-50':
              route.name === OrgUsageRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/Usage.svg" class="h-6 w-6" />
          <span class="ml-3 flex-1 text-left">Usage</span>
        </router-link>

        <router-link
          :to="{ name: TeamRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-200 bg-zinc-50': route.name === TeamRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/Team.svg" class="h-6 w-6" />

          <span class="ml-3 flex-1">Team</span>
        </router-link>

        <!-- Hidden as there is nothing to show for now. -->
        <!-- <router-link
          :to="{ name: OrgRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-200 bg-zinc-50': route.name === OrgRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/Org.svg" class="h-6 w-6" />
          <span class="ml-3 flex-1 text-left">Organisation</span>
        </router-link> -->

        <router-link
          :to="{ name: ManageSubscriptionRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-200 bg-zinc-50':
              route.name === ManageSubscriptionRoute.name,
          }"
          @click="drawer.hide"
        >
          <img
            src="../../assets/SideDrawerIcon/Subscription.svg"
            class="h-6 w-6"
          />
          <span class="ml-3 flex-1 text-left">Subscription</span>
        </router-link>

        <router-link
          :to="{ name: ApiKeyRoute.name }"
          class="group flex w-full rounded-lg p-2 text-zinc-900"
          :class="{
            'border border-zinc-200 bg-zinc-50':
              route.name === ApiKeyRoute.name,
          }"
          @click="drawer.hide"
        >
          <img src="../../assets/SideDrawerIcon/ApiKey.svg" class="h-6 w-6" />
          <span class="ml-3 flex-1 text-left">API Keys</span>
        </router-link>
      </div>

      <!-- Spacer divider that takes up all the space in the middle -->
      <div class="grow"></div>

      <router-link
        :to="{ name: ProfileRoute.name }"
        class="flex w-full rounded-lg p-2 text-start text-zinc-800"
        :class="{
          'border border-zinc-200 bg-zinc-50': route.name === ProfileRoute.name,
        }"
        @click="drawer.hide"
      >
        <img src="../../assets/SideDrawerIcon/Profile.svg" class="h-6 w-6" />
        <span class="ml-3 flex-1">Profile</span>
      </router-link>

      <!-- <router-link
        :to="{ name: SettingsRoute.name }"
        class="flex w-full rounded-lg p-2 text-start text-zinc-800"
        :class="{
          'border border-zinc-200 bg-zinc-50':
            route.name === SettingsRoute.name,
        }"
        @click="drawer.hide"
      >
        <img src="../../assets/SideDrawerIcon/Settings.svg" class="h-6 w-6" />
        <span class="ml-3 flex-1">Settings</span>
      </router-link> -->

      <!-- @todo Create link -->
      <a
        class="flex w-full rounded-lg p-2 text-start text-zinc-800"
        target="_blank"
        @click="drawer.hide"
      >
        <img src="../../assets/SideDrawerIcon/Help.svg" class="h-6 w-6" />
        <span class="ml-3 flex-1">Help me!</span>
      </a>

      <button
        class="flex w-full p-2 text-start text-zinc-800"
        @click="closeAndLogout"
      >
        <img src="../../assets/SideDrawerIcon/logout.svg" class="h-6 w-6" />
        <span class="ml-3 flex-1">Logout</span>
      </button>
    </div>
  </nav>
</template>
