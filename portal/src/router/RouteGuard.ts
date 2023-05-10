import type {
  NavigationGuardWithThis,
  RouteLocationNormalized,
} from "vue-router";

import { AuthType } from "./AuthType";
import type { PrivateRouteNames } from "./PrivateRoutes";
import type { PublicRouteNames } from "./PublicRoutes";

export type RouteGuard = NavigationGuardWithThis<undefined>;

/**
 * Type of the Authentication Predicate expected by the RouteGuard
 * factory function, which should be passed in by the router user
 * via the `createRouterWithGuard` function in `CreateRouter`.
 *
 * This predicate will get the current navigation's to and from route,
 * although note that it is not needed for you to use these arguements
 * and you can simply just read from an external library like firebase
 * authentication to check if your user is authenticated.
 */
export type AuthenticationPredicate = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => boolean | Promise<boolean>;

/**
 * Utility function to create an object to easily check the required
 * auth requirement of a route object.
 */
const requiredAuth = (AuthRequirements?: AuthType) => ({
  public: AuthRequirements === AuthType.Public,
  public_only: AuthRequirements === AuthType.PublicOnly,
  private: AuthRequirements === AuthType.Private,
});

/**
 * RouteGuard Factory Function, creates a new route guard with a given
 * authentication predicate and default redirects.
 *
 * Only used by the create router with guard factory function, and since
 * that is the public interface and this is the internal factory function,
 * all the params here are required, since that wrapper should be the one
 * dealing with default values.
 */
export const routeGuardFF = (
  authenticationPredicate: AuthenticationPredicate,
  redirect_for_route_protected_but_not_authenticated: PublicRouteNames,
  redirect_for_route_public_only_but_authenticated: PrivateRouteNames
): RouteGuard =>
  async function (to, from, next) {
    /** Get user's authentication status using the provided authentication predicate */
    const isAuthenticated = await authenticationPredicate(to, from);

    /**
     * Get auth requirements from first route object that matches with route navigated to,
     * and convert it into a easier to use auth requirement object for the checking below.
     */
    const AuthType_required_is = requiredAuth(
      to.matched[0]?.meta.AuthRequirements as AuthType | undefined
    );

    /* Call the next middleware based on authentication status */

    // If route is auth protected and user not authenticated, redirect to login page
    if (AuthType_required_is.private && !isAuthenticated)
      next({ name: redirect_for_route_protected_but_not_authenticated });
    // If route is public only and user is authenticated, redirect to default private route of home
    else if (AuthType_required_is.public_only && isAuthenticated)
      next({ name: redirect_for_route_public_only_but_authenticated });
    // Else, just continue navigation as per user request.
    else next();
  };
