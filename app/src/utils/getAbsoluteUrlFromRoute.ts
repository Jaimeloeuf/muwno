import type { RouteLocationRaw } from "vue-router";
import { router } from "../router/Router";

/**
 * Get an Absolute URL of the given Route object based on the current relative
 * URL used.
 */
export const getAbsoluteUrlFromRoute = (route: RouteLocationRaw) =>
  new URL(router.resolve(route).href, window.location.origin).href;
