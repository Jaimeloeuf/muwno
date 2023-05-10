export const HomeRoute = <const>{
  path: "/",
  name: "home",
  component: () => import("../views/core/Home.vue"),
};

export const FormRoute = <const>{
  path: "/form",
  name: "form",
  component: () => import("../views/Form/Form.vue"),
};
