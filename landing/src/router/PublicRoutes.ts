export const NotFoundRoute = <const>{
  path: "/:pathMatch(.*)*",
  name: "404",
  component: () => import("../views/404.vue"),
};

export const HomeRoute = <const>{
  name: "home",
  path: "/",
  component: () => import("../views/Home/Home.vue"),
};

export const PricingRoute = <const>{
  name: "pricing",
  path: "/pricing",
  component: () => import("../views/Pricing/Pricing.vue"),
};

export const DebugRoute = <const>{
  name: "debug",
  path: "/debug",
  component: () => import("../views/Debug.vue"),
};
