// Setup everything needed before setting up the Vue app.
import "./setup";

import { auth } from "./utils";
import { createApp } from "vue";
import { router } from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { initStoresOnAppStartIfLoggedIn } from "./store";

/**
 * Why is app creation wrapped in this?
 *
 * Wait for firebase auth to finish initialization before creating the app. So
 * that router navigation which relies on auth state wont break.
 */
auth.authStateReady().then(() => {
  console.debug("FBAuth.authStateReady");

  // Create and mount the Vue app
  createApp(App)
    .use(router)
    .use(createPinia().use(piniaPluginPersistedstate))
    .mount("#app");

  console.debug("App mounted");

  // If the user is logged in, run the required init functions. This is only
  // called after `createApp` to ensure that pinia stores are installed.
  if (auth.currentUser !== null) initStoresOnAppStartIfLoggedIn();
});
