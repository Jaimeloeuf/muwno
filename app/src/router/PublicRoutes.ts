import type { RouteLocationNormalized } from "vue-router";

import type { PublicRoute } from "./RouteTypes";
import { AuthType } from "./AuthType";

/*
  Define all Public Route Objects here, before adding them to the
  type checking array defined at the bottom of this module.

  const assertion is needed to tell TS to use stricter types, by
  treating string types like the `name` property as a string literal
  type instead of a string type (ie dont widen any types), so that
  it can be properly inferred for `PublicRouteNames`.
*/

export const LoginRoute = <const>{
  path: "/",
  name: "login",
  props: (route: RouteLocationNormalized) => route.query,
  component: () => import("../views/core/Auth/Login.vue"),
  meta: { AuthRequirements: AuthType.PublicOnly },
};

export const SignupRoute = <const>{
  path: "/signup",
  name: "signup",
  props: (route: RouteLocationNormalized) => route.query,
  component: () => import("../views/core/Auth/Signup.vue"),
  meta: { AuthRequirements: AuthType.PublicOnly },
};

export const DebugRoute = <const>{
  path: "/debug",
  name: "debug",
  component: () => import("../views/Debug.vue"),
  meta: { AuthRequirements: AuthType.Public },
};

/**
 * This array is only used internally for typechecking and type creation
 * purposes only, and is never used as a value anywhere, therefore there is no
 * need to worry about this array's runtime cost as this will be tree shaked
 * away as dead code.
 *
 * Add all route objects defined in this file to this array for typechecking to
 * ensure that the route objects satisfies the `PublicRoute` type constrain
 * using the `satisfies` operator.
 *
 * Typechecking is done here instead of doing it for every Route Object
 * individually as the RouteObjects cannot be annotated with the `PublicRoute`
 * type directly at the point of creation as that will widen the RouteObject
 * type to be that of `PublicRoute` and ignore the const assertion, which is
 * critical for treating the `name` field as a string literal type for
 * `RouteName` type to be properly inferred.
 */
[LoginRoute, SignupRoute, DebugRoute] satisfies Array<PublicRoute>;
