export const HomeRoute = <const>{
  name: "home",
  path: "/",
  component: () => import("../views/Home/Home.vue"),
};

export const DebugRoute = <const>{
  name: "debug",
  path: "/debug",
  component: () => import("../views/Debug.vue"),
};
