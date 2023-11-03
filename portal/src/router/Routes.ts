import type { RouteObject } from "./RouteTypes";

import { LoginRoute, SignupRoute, DebugRoute } from "./PublicRoutes";
import {
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
} from "./PrivateRoutes";
import { NotFoundRoute } from "./NotFoundRoute";

/**
 * All the **USER DEFINED** route objects to be registered with the router.
 * User MUST explicitly import route objects from their definition modules,
 * PrivateRoutes and PublicRoutes, and put it in this array for the router.
 *
 * The const assertion is used to ensure that this array cannot be modified
 * during runtime, all route object registration must be done here.
 */
export const Routes = (<const>[
  // Private Routes
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

  /* Public Routes */
  LoginRoute,
  SignupRoute,
  DebugRoute,

  /* Public Only Routes */
  // ...

  NotFoundRoute,

  // `satisfies` operator is used to typecheck all RouteObjects to ensure
  // that the AuthRequirements field is defined in the meta field.
]) satisfies ReadonlyArray<RouteObject>;

/**
 * Union type of all allowed Route names.
 */
export type RouteName = (typeof Routes)[number]["name"];

// =======================================================================
// Only run this router check while in development mode
// Check to find if there are any duplicate route object names or paths
// if (import.meta.env.MODE === "development") {
//   console.info("DEV: Running router check in dev mode");

//   const names = Object.create(null);
//   const paths = Object.create(null);

//   for (const route of Routes) {
//     if (names[route.name])
//       throw new Error(
//         `DEV ROUTER ERROR: Found duplicate route object name '${route.name}'`
//       );
//     if (paths[route.path])
//       throw new Error(
//         `DEV ROUTER ERROR: Found duplicate route path '${route.path}'`
//       );

//     names[route.name] = true;
//     paths[route.path] = true;
//   }
// }
