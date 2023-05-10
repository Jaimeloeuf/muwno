// Import to run the side effect of setting base Urls before it is used elsewhere
import "./API";

// import { auth, onAuthStateChanged } from "./firebase";

// import type { ComponentPublicInstance } from "vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { router } from "./router";
import App from "./App.vue";
// import { initStoresOnAppStartIfLoggedIn } from "./store";

// App variable to store reference to the vue App object
// let app: ComponentPublicInstance;

/**
 * Why is app creation wrapped in this?
 *
 * Wait for firebase to finish initialization before creating the app.
 * So that the router navigation wont break due to invalid auth
 */
// const unsubscribe = onAuthStateChanged(auth, (user) => {
//   // Prevent app initialization from running more than once
//   if (!app) {
//     // Create new vue app
//     app = createApp(App)
//       .use(router)
//       .use(createPinia().use(piniaPluginPersistedstate))
//       .mount("#app");

//     // If the user is logged in, run the required init functions.
//     // This is only called after `createApp` to ensure that pinia stores are installed
//     if (user !== null) initStoresOnAppStartIfLoggedIn();
//   }

//   // Use the firebase.Unsubscribe function returned from adding auth state change listner to unsubscribe
//   // To prevent new Vue from running more than once
//   unsubscribe();
// });

createApp(App)
  .use(router)
  .use(createPinia().use(piniaPluginPersistedstate))
  .mount("#app");
