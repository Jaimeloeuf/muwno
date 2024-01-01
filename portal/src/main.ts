// Import to run the side effect of 'removeSW'
import "./sw/removeSW";

// Import to run the side effect of setting base Urls before it is used elsewhere
import "./API";

import { auth, onAuthStateChanged } from "./firebase";
import { type ComponentPublicInstance, createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { router } from "./router";
import App from "./App.vue";
import { initStoresOnAppStartIfLoggedIn } from "./store";

// App variable to store reference to the vue App object
let app: ComponentPublicInstance;

/**
 * Why is app creation wrapped in this?
 *
 * Wait for firebase to finish initialization before creating the app.
 * So that the router navigation wont break due to invalid auth
 */
const unsubscribe = onAuthStateChanged(auth, (user) => {
  // Prevent app initialization from running more than once
  if (!app) {
    // Use firebase.Unsubscribe function returned from authStateChange listener
    // to unsubscribe to prevent this from running more than once.
    unsubscribe();

    // Create new vue app
    app = createApp(App)
      .use(router)
      .use(createPinia().use(piniaPluginPersistedstate))
      .mount("#app");

    // If the user is logged in, run the required init functions. This is only
    // called after `createApp` to ensure that pinia stores are installed.
    if (user !== null) initStoresOnAppStartIfLoggedIn();
  }
});
