import {
  router,
  type PublicRouteNames,
  type PrivateRouteNames,
} from "../router";

/**
 * Get an Absolute URL of the given Route object based on the current relative
 * URL used.
 */
export const getAbsoluteUrlFromRoute = (
  routeName: PublicRouteNames | PrivateRouteNames
) =>
  new URL(router.resolve({ name: routeName }).href, window.location.origin)
    .href;
