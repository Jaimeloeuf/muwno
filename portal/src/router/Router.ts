import { createRouter, createWebHashHistory } from "vue-router";
import { Routes } from "./Routes";
import { routeGuard } from "./RouteGuard";

const router = createRouter({
  history: createWebHashHistory(),

  // Alternatively, import 'createWebHistory' from "vue-router" to use history mode instead
  // history: createWebHistory(),

  // Always scroll to top of view on first visit and no savedPosition, else reuse savedPosition
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    else return { top: 0 };
  },

  routes: Routes,
});

// Run route guard before every navigation to check user's authentication
// and onboarding status against the route's requirement.
router.beforeEach(routeGuard);

export { router };
