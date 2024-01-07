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
 *
 * @todo Add a APM tool like sentry or something
 */
router.onError((error, to) => {
  console.error("RouterError: ", error);

  // If error message specifies failed dynamic import of the Route's component,
  // assume that the error is caused by version drift/skew, where users are
  // still using the old version after a new version is deployed. Attempt to
  // solve it by reloading the page or triggering the browser to load the new
  // route directly by navigating there instead of loading it dynamically.
  //
  // Error messages are usually either "failed to fetch dynamically imported
  // module" or "TypeError: error loading dynamically imported module".
  if (
    error.message.lowercase().includes("importing a module script failed") ||
    error.message.lowercase().includes("dynamically imported module")
  ) {
    // The route might not have a full path, so reload page if not found.
    if (to?.fullPath) window.location.href = to.fullPath;
    else window.location.reload();
    return;
  }

  // If it is an unknown error, show user with <GlobalError> view.
  routerError.value = error;
});

export { router };
