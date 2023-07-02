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

export const FeedbackRoute = <const>{
  name: "feedback",
  path: "/feedback/:formID",
  props: true,
  component: () => import("../views/Feedback/Feedback.vue"),
};

export const FeedbackSubmittedRoute = <const>{
  name: "feedback-submitted",
  path: "/feedback-submitted",
  component: () => import("../views/Feedback/Submitted.vue"),
};
