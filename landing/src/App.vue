<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

import { useLoader } from "./store";
import GlobalErrorView from "./views/GlobalError.vue";
import Loader from "./views/components/Loader.vue";

const loader = useLoader();

const globalError = ref<Error | null>(null);
onErrorCaptured((e) => {
  globalError.value = e;
});

/**
 * Clear the global error flag and loader.
 */
function clearError() {
  // This is wrapped in setTimeout because if the 'v-if' conditional rendering
  // updates before the `router.back()` can change the router-view's dynamic
  // component, the router-view component is showed again with the page that
  // errored before it is navigated away will cause the error to be thrown and
  // bubbled up here again, even if the URL has changed to navigate user to the
  // last working page, it still shows the global error view component.
  //
  // The 100 milliseconds timeout value is arbitrary, it needs to be long enough
  // for the router-back update to take effect but not too long that it seems
  // like the clear error action froze, and 100ms is a good in between.
  setTimeout(() => (globalError.value = null), 100);

  // Clears any loader still shown too, since an error might be thrown before
  // loader can be hidden again, making it always show the loader even after
  // the error is cleared.
  loader.hide();
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
        -->
        <div>
          <Loader v-if="loader.showLoader" />
          <component :is="Component" />
        </div>

        <!-- loading UI -->
        <template #fallback><Loader /></template>
      </Suspense>
    </template>
  </RouterView>
</template>
