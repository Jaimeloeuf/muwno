/**
 * Hardcoded plan details object since there is only 1 plan now.
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

  supportedCurrencies: ['USD', 'SGD'],

  /**
   * Overage price per unit for each of the billable items
   */
  overage: {
    response: {
      price: {
        USD: 0.04,
        SGD: 0.05,
      },
    },

    email: {
      price: {
        USD: 0.0035,
        SGD: 0.005,
      },
    },

    responseStored: {
      price: {
        USD: 0.008,
        SGD: 0.01,
      },
    },

    customerStored: {
      price: {
        USD: 0.008,
        SGD: 0.01,
      },
    },
  },
};
