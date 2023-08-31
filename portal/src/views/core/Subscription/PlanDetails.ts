/**
 * Hardcoded plan details object since there is only 1 plan now.
 */
export const PlanDetails = <const>{
  included: {
    responses: 300,
    emails: 300,
  },
  price: {
    monthly: 100,
    yearly: 1000,
  },
  overageUnit: {
    responses: 100,
    emails: 1000,
  },
  overagePrice: {
    responses: 3,
    emails: 3,
  },
};
