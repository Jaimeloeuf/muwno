import { createRouter, createWebHistory } from "vue-router";

import { Routes } from "./Routes";

export const router = createRouter({
  history: createWebHistory(),

  // Always scroll to top of view on first visit and no savedPosition, else reuse savedPosition
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    else return { top: 0 };
  },

  routes: Routes,
});
