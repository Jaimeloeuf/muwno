import type { RouteLocationNormalized } from "vue-router";

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

/* ============================ Core Module Routes ========================= */

export const OnboardingRoute = <const>{
  name: "onboarding",
  path: "/onboarding",
  component: () => import("../views/core/Onboarding.vue"),
  meta: { AuthRequirements: AuthType.Private, onboarding: true },
};

export const ProfileRoute = <const>{
  name: "profile",
  path: "/profile",
  component: () => import("../views/core/Profile.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

/* ============================= Org Module Routes ========================== */

export const OrgRoute = <const>{
  name: "org",
  path: "/org",
  component: () => import("../views/core/Org/Org.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const CreateOrgRoute = <const>{
  name: "org-create",
  path: "/org/create",
  component: () => import("../views/core/Org/CreateOrg.vue"),
  meta: { AuthRequirements: AuthType.Private, onboarding: true },
};

/* =========================== Product Module Routes ======================== */

export const AllProductRoute = <const>{
  name: "product-all",
  path: "/product/all",
  component: () => import("../views/core/Product/AllProduct/AllProduct.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const AddProductRoute = <const>{
  name: "product-add",
  path: "/product/add",
  component: () => import("../views/core/Product/AddProduct.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const ProductRoute = <const>{
  name: "product-view",
  path: "/product/view/:productID",
  props: true,
  component: () => import("../views/core/Product/View/Product.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const MoreProductFeatureRoute = <const>{
  name: "product-more",
  path: "/product/view/:productID/more",
  props: true,
  component: () => import("../views/core/Product/View/MoreProductFeatures.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const AllTaskRoute = <const>{
  name: "product-task-all",
  path: "/product/task/all/:productID",
  props: true,
  component: () => import("../views/core/Product/View/AllTask.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const EditTaskRoute = <const>{
  name: "product-task-edit",
  path: "/product/task/edit/:taskID",
  props: true,
  component: () => import("../views/core/Product/View/EditTask.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

/* ========================== Survey Module Routes ========================== */

export const SurveyResponseRoute = <const>{
  name: "survey-response",
  path: "/survey/response/:productID/:responseID",
  props: (route: RouteLocationNormalized) => ({
    ...route.params,
    ...route.query,
  }),
  component: () => import("../views/core/SurveyResponse.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

/* ====================== Survey Method Module Routes ====================== */

export const SurveyMethodsRoute = <const>{
  name: "survey-methods",
  path: "/survey/methods/:productID",
  props: true,
  component: () => import("../views/core/SurveyMethod/SurveyMethods.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

/* ========================= Customer Module Routes ========================= */

export const CustomerRoute = <const>{
  name: "customer",
  path: "/customer",
  component: () => import("../views/core/Customer/Customer.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const ImportCustomerRoute = <const>{
  name: "customer-import",
  path: "/customer/import",
  component: () => import("../views/core/ImportCustomer.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

/* ============================ Team Module Routes ========================= */

export const TeamRoute = <const>{
  name: "team",
  path: "/team",
  component: () => import("../views/core/Team/Team.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const InviteMemberRoute = <const>{
  name: "team-invite",
  path: "/team/invite",
  component: () => import("../views/core/Team/InviteMember.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

export const PendingInvitationRoute = <const>{
  name: "team-pending-invitation",
  path: "/team/pending/invitation",
  component: () => import("../views/core/Team/PendingInvitations.vue"),
  meta: { AuthRequirements: AuthType.Private, onboarding: true },
};

/* ======================== Subscription Module Routes ===================== */

export const BuySubscriptionPlanRoute = <const>{
  name: "subscription-buy",
  path: "/subscription/buy",
  component: () => import("../views/core/Subscription/BuySubscription.vue"),
  meta: { AuthRequirements: AuthType.Private, onboarding: true },
};

export const SetupPaymentMethodRoute = <const>{
  name: "subscription-setup-payment-method",
  path: "/subscription/setup-payment-method",
  component: () =>
    import("../views/core/Subscription/Stripe/SetupPaymentMethod.vue"),
  meta: { AuthRequirements: AuthType.Private, onboarding: true },
};

export const SetupSuccessPaymentRoute = <const>{
  name: "subscription-setup-payment-success",
  path: "/subscription/setup-payment-success",
  component: () =>
    import("../views/core/Subscription/Stripe/SetupPaymentSuccess.vue"),
  meta: { AuthRequirements: AuthType.Private, onboarding: true },
};

export const ManageSubscriptionRoute = <const>{
  name: "subscription-manage",
  path: "/subscription/manage",
  props: (route: RouteLocationNormalized) => route.query,
  component: () => import("../views/core/Subscription/ManageSubscription.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

/* ========================= API Key Module Routes ========================= */

export const ApiKeyRoute = <const>{
  name: "api-key",
  path: "/api-key",
  component: () => import("../views/core/ApiKey.vue"),
  meta: { AuthRequirements: AuthType.Private },
};

/* ========================== Usage Module Routes ========================== */

export const OrgUsageRoute = <const>{
  name: "usage-org",
  path: "/usage/org",
  component: () => import("../views/core/Usage/OrgUsage.vue"),
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
  OnboardingRoute,
  ProfileRoute,
  OrgRoute,
  CreateOrgRoute,
  AllProductRoute,
  ProductRoute,
  MoreProductFeatureRoute,
  AllTaskRoute,
  EditTaskRoute,
  SurveyResponseRoute,
  AddProductRoute,
  SurveyMethodsRoute,
  CustomerRoute,
  ImportCustomerRoute,
  TeamRoute,
  InviteMemberRoute,
  PendingInvitationRoute,
  BuySubscriptionPlanRoute,
  SetupPaymentMethodRoute,
  SetupSuccessPaymentRoute,
  ManageSubscriptionRoute,
  ApiKeyRoute,
  OrgUsageRoute,
] satisfies Array<PrivateRoute>;

/**
 * Sum type of all Private Route object names, used to constrain
 * function parameters' type instead of just accepting string type.
 */
export type PrivateRouteNames = (typeof PrivateRoutes)[number]["name"];
