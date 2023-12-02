import type { RouteLocationNormalized } from "vue-router";

export const NotFoundRoute = <const>{
  path: "/:pathMatch(.*)*",
  name: "404",
  component: () => import("../views/404.vue"),
};

export const HomeRoute = <const>{
  name: "home",
  path: "/",
  component: () => import("../views/core/Home.vue"),
};

export const DebugRoute = <const>{
  name: "debug",
  path: "/debug",
  component: () => import("../views/core/Debug.vue"),
};

export const PmfSurveyRoute = <const>{
  name: "survey-pmf",
  path: "/pmf/:formID",
  props: (route: RouteLocationNormalized) => ({
    ...route.params,
    ...route.query,
  }),
  component: () => import("../views/survey/pmf/PMFSurvey.vue"),
};

export const PmfSurveySubmittedRoute = <const>{
  name: "survey-pmf-submitted",
  path: "/pmf/form/submitted",
  props: (route: RouteLocationNormalized) => route.query,
  component: () => import("../views/survey/pmf/Submitted.vue"),
};
