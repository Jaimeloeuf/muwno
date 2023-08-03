// Import to run the side effect of setting base Urls before it is used elsewhere
import "./API";

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// import { plugin, defaultConfig } from "@formkit/vue";
import { router } from "./router";
import App from "./App.vue";

createApp(App)
  .use(router)
  .use(createPinia().use(piniaPluginPersistedstate))
  // @todo Delete this once we stop using formkit
  // .use(plugin, defaultConfig)
  .mount("#app");
