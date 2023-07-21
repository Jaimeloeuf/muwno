import { createRouter, createWebHashHistory } from "vue-router";

import { Routes } from "./Routes";

export const router = createRouter({
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
