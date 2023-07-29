// Import to run the side effect of setting base Urls before it is used elsewhere
import "./API";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";
import App from "./App.vue";

createApp(App).use(router).use(createPinia()).mount("#app");
