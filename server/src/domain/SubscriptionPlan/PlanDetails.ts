/**
 * Hardcoded plan details object since there is only 1 plan now.
 *
 * See '/docs/Issue with JS math precision for Stripe Prices.md'
 */
export const PlanDetails = <const>{
  /**
   * Included free tier quota for each of the billable items
   */
  included: {
    response: 30,
    email: 30,
    responseStored: 300,
    customerStored: 300,
  },

  /**
   * Overage price per unit for each of the billable items
   */
  overage: {
    response: {
      price: {
        USD: 0.05,
      },
    },

    email: {
      price: {
        // 1.8 USD per 1000 emails sent -> 0.0018 USD // Postmark high estimate
        // 1.0 USD per 1000 emails sent -> 0.0010 USD // Sendgrid high estimate
        USD: 0.002,
      },
    },

    responseStored: {
      price: {
        USD: 0.005,
      },
    },

    customerStored: {
      price: {
        USD: 0.005,
      },
    },
  },
};
