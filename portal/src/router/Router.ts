import { createNewRouter } from "./CreateNewRouter";
import { LoginRoute, OrgRoute } from "./index";
import { authGuard } from "@auth0/auth0-vue";

/**
 * Router created for this project
 */
export const router = createNewRouter(
  LoginRoute.name,
  OrgRoute.name,
  authGuard
);
