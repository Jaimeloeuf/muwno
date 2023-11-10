import { createRouter, createWebHashHistory } from "vue-router";
import { Routes } from "./Routes";
import { routeGuard } from "./RouteGuard";
import { routerError } from "./RouterError";

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

/**
 * This error handler is called every time a non caught error happens during
 * navigation, including errors thrown synchronously and asynchronously, errors
 * returned or passed to next in any navigation guard, and errors occurred when
 * trying to resolve an async component that is required to render a route.
 *
 * Once the error is caught, it is set on the reactive `routerError` which is
 * used by the root App.vue to show the error page instead of showing the
 * default loader screen indefinitely.
 */
router.onError((error) => {
  console.error("RouterError: ", error);
  routerError.value = error;
});

export { router };
