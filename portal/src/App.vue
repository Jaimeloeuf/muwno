<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";
import { useRouter } from "vue-router";

import { useLoader, useNotif } from "./store";
import GlobalErrorView from "./views/GlobalError.vue";
import Loader from "./views/components/Loader.vue";
import Snackbar from "./views/components/Snackbar.vue";

const router = useRouter();
const loader = useLoader();
const notif = useNotif();

const globalError = ref<Error | null>(null);
onErrorCaptured((e) => {
  globalError.value = e;
});

/**
 * Clear the global error flag and navigate to the last working page.
 */
function clearError() {
  // Navigate back to the last working page
  router.back();

  // Clear the global error flag.
  //
  // This needs to be wrapped in a setTimeout because the v-if conditional
  // rendering updates before the `router.back()` can change the router-view's
  // dynamic component, which means that the router-view component is showed
  // again with the page that errored before it is navigated away. This causes
  // the error to be thrown and bubbled up here again, even if the URL has
  // changed to navigate the user to the last working page, it still shows
  // the global error view component.
  //
  // The 100 milliseconds timeout value is arbitrary, it needs to be long
  // enough for the router-back update to take effect but not too long that it
  // seems like the clear error action froze, and 100ms is a good in between.
  setTimeout(() => (globalError.value = null), 100);
}
</script>

<template>
  <GlobalErrorView
    v-if="globalError !== null"
    :globalError="globalError"
    @acknowledged="clearError"
  />

  <!--
    Using path as key so that when a URL param is updated, it is treated a new
    page instead of just reusing the same page without updating anything.
  -->
  <RouterView v-else v-slot="{ Component }" :key="$route.path">
    <!-- This is needed to ensure that the loading state renders properly. -->
    <template v-if="Component">
      <!--
        A timeout MUST BE specified for the fallback content to be shown by default.
        Arbitrary timeout of 10 milliseconds to account for super quick
        dynamic route loading or flush behaviour to prevent flickering.

        References:
        https://github.com/vuejs/router/issues/560
        https://github.com/vuejs/core/issues/2142
      -->
      <Suspense :timeout="10">
        <!--
          Main dynamic content from router-view.

          Suspense slots expect a single root node and cannot support fragments
          in components, therefore an extra `div` is used to wrap it to only
          have a single element passed to Suspense's default slot.

          A template tag cannot be used instead as it is compiled away and will
          just end up exposing the fragment to Suspense again. Therefore a div
          has to be used. A `template` tag would also require the #default slot
          name to be specified since the template tag is part of the slot API
          and cannot be used directly without any slot name since that will just
          mean that the default slot becomes empty.

          References:
          https://github.com/vuejs/core/issues/2143
          https://github.com/vuejs/core/issues/3795
          https://v2.vuejs.org/v2/guide/conditional.html#Conditional-Groups-with-v-if-on-lt-template-gt
          https://stackoverflow.com/questions/10704575/is-there-any-html-element-without-any-style
          https://caniuse.com/css-display-contents

          The p-6 padding will only be applied to `<component :is="Component" />`
          since both Loader and Snackbar uses `fixed` positioning to position
          themselves relative to the browser window and is not affected by the
          padding at all.
        -->
        <div class="p-6">
          <component :is="Component" />

          <!-- Conditionally loaded `fixed` positioned components -->
          <Loader v-if="loader.showLoader" />
          <Snackbar v-if="notif.showSnackbar" />
        </div>

        <!-- loading UI -->
        <template #fallback><Loader /></template>
      </Suspense>
    </template>
  </RouterView>
</template>
