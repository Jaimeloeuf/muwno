<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from "vue-router";
import { useNotif } from "../../store";
import { AllProductRoute } from "../../router";

const props = defineProps<{
  /**
   * ## WARNING
   * **Do not use this** unless absolutely neccessary. Since this will cause a
   * forward navigation with `router.push` and if you navigate forward to a page
   * with a back button, it will come back to this page on click which might
   * cause cyclical back navigation routes! Only use this if you are navigating
   * back to a page with no back button.
   *
   * Custom back route can be specified instead of just going back one step in
   * navigation history.
   */
  to?: RouteLocationRaw | undefined;
}>();

const router = useRouter();
const notif = useNotif();

/**
 * Navigate backwards using values passed in and the current router state.
 */
function back() {
  // Whatever route the caller specifies always take priority
  if (props.to !== undefined) {
    router.push(props.to);
  }

  // Use the last route user navigated from as the back route
  else if (
    router.options.history.state.back !== null &&
    typeof router.options.history.state.back === "string"
  ) {
    router.back();
  }

  // If there is no back route, i.e. user opened current page from a new tab /
  // another website, then redirect to the default back route, a.k.a Home page.
  else {
    router.push({ name: AllProductRoute.name });
    notif.setSnackbar("No back page found, returning to Home Page");
  }
}
</script>

<template>
  <button class="rounded-lg bg-zinc-100 px-3 py-0.5" @click="back">
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
  </button>
</template>
