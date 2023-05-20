export const HomeRoute = <const>{
  name: "home",
  path: "/",
  component: () => import("../views/core/Home.vue"),
};

export const FormRoute = <const>{
  name: "form",
  path: "/form/:formID",
  props: true,
  component: () => import("../views/Form/Form.vue"),
};

export const SubmittedRoute = <const>{
  name: "submitted",
  path: "/submitted",
  component: () => import("../views/Form/Submitted.vue"),
};
