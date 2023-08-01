// Import to run the side effect of setting base Urls before it is used elsewhere
import "./API";

import { createApp, watchEffect } from "vue";
import { auth0 } from "./auth0";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { router } from "./router";
import App from "./App.vue";
import { initStoresOnAppStartIfLoggedIn } from "./store";

createApp(App)
  .use(router)
  // Auth0 must be registered after router to prevent unexpected behaviors
  .use(auth0)
  .use(createPinia().use(piniaPluginPersistedstate))
  .mount("#app");

/**
 * Handle to stop watching for reactive changes.
 */
const stopWatchEffect = watchEffect(() => {
  // Once auth0 SDK completes the PKCE flow,
  // If the user is logged in, run the required init functions.
  if (!auth0.isLoading.value)
    if (auth0.isAuthenticated.value) {
      // Stop the watch effect function from being called again to prevent
      // `initStoresOnAppStartIfLoggedIn` from getting called more than once.
      stopWatchEffect();

      // This is only called after `createApp` to ensure that pinia stores are
      // installed since most of the init functions are pinia store methods.
      //
      // Run the `initStoresOnAppStartIfLoggedIn` function after making sure the
      // watchEffect is stopped since this contains async code which will cause
      // issue with calling stopWatchEffect.
      initStoresOnAppStartIfLoggedIn();
    }
});
