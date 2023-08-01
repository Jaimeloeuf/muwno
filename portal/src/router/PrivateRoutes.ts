// import type { RouteLocationNormalized } from "vue-router";
// props: (route: RouteLocationNormalized) => route.query,

import type { PrivateRoute } from "./RouteTypes";
import { AuthType } from "./AuthType";

/*
  Define all Private Route Objects here, before adding them to the
  type checking array defined at the bottom of this module.

  const assertion is needed to tell TS to use stricter types, by
  treating string types like the `name` property as a string literal
  type instead of a string type (ie dont widen any types), so that
  it can be properly inferred for `PrivateRouteNames`.
*/

/* ================================== Core Module Routes =============================== */

export const ProfileRoute = <const>{
  name: "profile",
  path: "/profile",
  component: () => import("../views/core/Profile.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const OrgRoute = <const>{
  name: "org",
  path: "/org",
  component: () => import("../views/core/Org.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const CreateOrgRoute = <const>{
  name: "org-create",
  path: "/org/create",
  component: () => import("../views/core/CreateOrg.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

/* ================================== Product Module Routes =============================== */

export const ProductRoute = <const>{
  name: "product-view",
  path: "/product/view/:productID",
  props: true,
  component: () => import("../views/core/Product.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const AddProductRoute = <const>{
  name: "product-add",
  path: "/product/add",
  component: () => import("../views/core/AddProduct.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const ImportCustomerRoute = <const>{
  name: "product-import-customer",
  path: "/product/:productID/customer/import",
  props: true,
  component: () => import("../views/core/ImportCustomer.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

/**
 * This array is only used internally for typechecking and type creation purposes
 * only, and is never used as a value anywhere, therefore there is no need to worry
 * about this array's runtime cost as this will be tree shaked away as dead code.
 *
 * Add all route objects defined in this file to this array for typechecking to
 * ensure that the route objects satisfies the `PrivateRoute` type constrain using
 * the `satisfies` operator.
 *
 * Typechecking is done here instead of doing it for every Route Object individually
 * as the RouteObjects cannot be annotated with the `PrivateRoute` type directly at the
 * point of creation as that will widen the RouteObject type to be that of `PrivateRoute`
 * and ignore the const assertion, which is critical for treating the `name` field as
 * a string literal type for `PrivateRouteNames` type to be properly inferred.
 */
const PrivateRoutes = [
  ProfileRoute,
  OrgRoute,
  CreateOrgRoute,
  ProductRoute,
  AddProductRoute,
  ImportCustomerRoute,
] satisfies Array<PrivateRoute>;

/**
 * Sum type of all Private Route object names, used to constrain
 * function parameters' type instead of just accepting string type.
 */
export type PrivateRouteNames = (typeof PrivateRoutes)[number]["name"];
