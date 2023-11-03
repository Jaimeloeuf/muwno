import { AuthType } from "./AuthType";

/* 404 Catch all route handler */
export const NotFoundRoute = <const>{
  path: "/:pathMatch(.*)*",
  name: "404",
  component: () => import("../views/404.vue"),
  meta: { AuthRequirements: AuthType.Public },
};
