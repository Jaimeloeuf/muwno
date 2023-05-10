import { createRouter, createWebHashHistory } from "vue-router";
import { routeGuardFF, type AuthenticationPredicate } from "./RouteGuard";
import type { PrivateRouteNames } from "./PrivateRoutes";
import type { PublicRouteNames } from "./PublicRoutes";

import { Routes } from "./Routes";

/**
 * Create a new Vue Router instance, and optionally attach a route guard.
 */
export function createNewRouter(
  redirect_for_route_protected_but_not_authenticated: PublicRouteNames,
  redirect_for_route_public_only_but_authenticated: PrivateRouteNames,
  authenticationPredicate?: AuthenticationPredicate
) {
  const router = createRouter({
    history: createWebHashHistory(),

    // Alternatively, import 'createWebHistory' from "vue-router" to use history mode instead
    // history: createWebHistory(),

    // Always scroll to top of view on first visit and no savedPosition, else reuse savedPosition
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) return savedPosition;
      else return { top: 0 };
    },

    /**
     * Register the array of Routes object with the Router and add in the
     * custom 404 page with a wildcard pattern as the last Route Object.
     *
     * Routes can use lazily loaded components with route level code-splitting
     * this generates a separate chunk (about.[hash].js) for this route
     * which is lazy-loaded when the route is visited.
     *
     * Alternative way to do this without spreading the array, however both
     * are not the most efficient, just that the spread operator makes this
     * more readable.
     * ```typescript
     * routes: [
     *   // 404 Catch all route handler
     *   {
     *     path: "/:pathMatch(.*)*",
     *     name: "404",
     *     component: () => import("../views/404.vue"),
     *   },
     * ].concat(Routes),
     * ```
     */
    routes: [
      ...Routes,

      /* 404 Catch all route handler */
      {
        path: "/:pathMatch(.*)*",
        name: "404",
        component: () => import("../views/404.vue"),
      },
    ],
  });

  // If a authentication predicate is passed in, create a new route guard and
  // run it before every navigation to check if user's current authentication
  // status matches the authentication requirements of the route being accessed.
  if (authenticationPredicate)
    router.beforeEach(
      routeGuardFF(
        authenticationPredicate,
        redirect_for_route_protected_but_not_authenticated,
        redirect_for_route_public_only_but_authenticated
      )
    );

  return router;
}
