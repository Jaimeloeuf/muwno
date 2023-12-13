<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

import { loader } from "./controllers";
import GlobalErrorView from "./views/GlobalError.vue";
import SideDrawer from "./views/shared/SideDrawer.vue";
import Loader from "./views/shared/Loader.vue";

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

  <template v-else>
    <!--
      All the top level components that uses `fixed` positioning to position
      themselves relative to the browser window and is not related to the Router
      page component directly, are placed outside of <RouterView>.
    -->

    <SideDrawer />

    <Loader v-if="loader.showLoader.value" />

    <!--
      Dynamic page view component injected by the Router.
      Using path as key so that when a URL param is updated, it is treated a new
      page instead of just reusing the same page without updating anything.
    -->
    <RouterView v-slot="{ Component }" :key="$route.path">
      <!-- Render dynamically selected router component when it is ready -->
      <template v-if="Component">
        <!--
          Wrap in suspense since Page level components can have top level await
          in setup functions, therefore suspense shows loader while awaiting.

          A timeout MUST BE specified for the fallback content to be shown by
          default. Arbitrary timeout of 10 milliseconds to account for super
          quick dynamic route loading or flush behaviour to prevent flickering.
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
            https://stackoverflow.com/questions/10704575/is-there-any-html-element-without-any-style
            https://caniuse.com/css-display-contents
          -->
          <div>
            <component :is="Component" />
          </div>

          <!--
            Show loader while awaiting for RouterView component's setup function
            to resolve asynchronously to support top level awaits in Vue SFC.
          -->
          <template #fallback>
            <Loader />
          </template>
        </Suspense>
      </template>

      <!--
        Show loader when router-view component is not ready instead of showing a
        blank screen while waiting for RouteGuard to asynchronously resolve.
      -->
      <Loader v-else />
    </RouterView>
  </template>
</template>
