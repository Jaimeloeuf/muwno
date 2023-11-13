<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from "vue-router";
import { useNotif } from "../../store";
import { AllProductRoute } from "../../router";

const props = defineProps<{
  /**
   * Custom back route can be specified instead of just going back one step in
   * navigation history. If specified, it will be pass to the router-link
   * component's `to` prop.
   */
  to?: RouteLocationRaw | undefined;
}>();

const router = useRouter();
const notif = useNotif();
let noBackRoute = false;

/**
 * Resolves the `backRoute` where the app will navigate to on clicking the back
 * button depending on values passed in and the current router state.
 */
function resolveRoute() {
  // Whatever route the caller specifies always take priority
  if (props.to !== undefined) return router.resolve(props.to);

  // Use the last route user navigated from as the back route
  if (
    router.options.history.state.back !== null &&
    typeof router.options.history.state.back === "string"
  )
    return router.resolve({ path: router.options.history.state.back });

  // If current page is the first route opened from a new opened tab or from
  // another website/webapp, route will resolve to the default Home page. This
  // also sets `noBackRoute` to notify user about this on navigation.
  noBackRoute = true;
  return router.resolve({ name: AllProductRoute.name });
}

/** Route to navigate to on clicking back */
const backRoute = resolveRoute();

/**
 * Function to notify user about redirecting to Home page if there is no valid
 * back route found and they clicked back.
 */
const onBackNavigation = () =>
  noBackRoute &&
  notif.setSnackbar("No back page found, returning to Home Page");
</script>

<template>
  <!--
    Using router link means it will always be a forward navigation by adding a
    new navigation to the history state. Thid does not navigate back using
    history state, to give users the ability to traverse through time all the
    navigation steps taken.
  -->
  <router-link
    :to="backRoute"
    class="rounded-lg bg-zinc-100 px-4 py-1.5"
    @click="onBackNavigation"
  >
    <svg
      class="inline-block h-6 w-6 rotate-180 text-zinc-600"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 7"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M1 5h12m0 0L9 1m4 4L9 9"
      />
    </svg>
  </router-link>
</template>
