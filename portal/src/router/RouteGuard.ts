import type {
  NavigationGuardWithThis,
  RouteLocationNormalized,
} from "vue-router";

import { AuthType } from "./AuthType";
import { LoginRoute } from "./PublicRoutes";
import { AllProductRoute, OnboardingRoute } from "./PrivateRoutes";

import { auth } from "../firebase";
import { useOnboarding } from "../store";

export type RouteGuard = NavigationGuardWithThis<undefined>;

/**
 * Type of the Authentication Predicate expected by the RouteGuard.
 *
 * This predicate will get the current navigation's to and from route,
 * although note that it is not needed for you to use these arguements
 * and you can simply just read from an external library like Firebase Auth /
 * Auth0 to check if your user is authenticated.
 */
type AuthenticationPredicate = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => boolean | Promise<boolean>;

/**
 * Actual Authentication Predicate using Firebase Auth.
 */
const authenticationPredicate: AuthenticationPredicate = () =>
  auth.currentUser !== null;

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
 * RouteGuard handles routing using user's authentication and onboarding status.
 */
export const routeGuard: RouteGuard = async function (to, from, next) {
  const isAuthenticated = await authenticationPredicate(to, from);

  const routeMeta = to.matched[0]?.meta;

  /**
   * Get auth requirements of first route object that matches route navigated to
   * and convert it to an auth requirement object for routing logic below.
   */
  const AuthType_required_is = requiredAuth(
    routeMeta?.AuthRequirements as AuthType | undefined
  );

  if (AuthType_required_is.private) {
    if (isAuthenticated) {
      // Check if route aligns with their current onboarding status.
      if (!routeMeta?.onboarding && (await useOnboarding().isOnboarding())) {
        // User tries to access a private non-onboarding route while they are
        // still onboarding, redirect to default onboarding route.
        next({ name: OnboardingRoute.name });
      }

      // Continue if aligned
      else next();
    }

    // Route is private and user is not authenticated, redirect to login
    else next({ name: LoginRoute.name });
  }

  // If route is public only and user is authenticated.
  else if (AuthType_required_is.public_only && isAuthenticated) {
    next({ name: AllProductRoute.name });
  }

  // Else, just continue navigation as per user request.
  else next();
};
