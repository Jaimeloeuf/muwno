import HomeComponent from "../views/Home/Home.vue";
import PricingComponent from "../views/Pricing/Pricing.vue";

export const NotFoundRoute = <const>{
  path: "/:pathMatch(.*)*",
  name: "404",
  component: () => import("../views/404.vue"),
};

export const HomeRoute = <const>{
  name: "home",
  path: "/",
  component: HomeComponent,
};

export const PricingRoute = <const>{
  name: "pricing",
  path: "/pricing",
  component: PricingComponent,
};

export const DebugRoute = <const>{
  name: "debug",
  path: "/debug",
  component: () => import("../views/Debug.vue"),
};
