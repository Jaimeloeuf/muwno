/**
 * Hardcoded plan details object since there is only 1 plan now.
 */
export const PlanDetails = <const>{
  supportedCurrencies: ['USD', 'SGD'],

  /**
   * Included quota for each of the billable items
   */
  included: {
    response: 1000,
    email: 1000,
    responseStored: 30000,
    customerStored: 30000,
  },

  /**
   * Price of standard subscription
   */
  price: {
    /**
     * Price of standard subscription in SGD
     */
    SGD: {
      monthly: 100,
      yearly: 1000,
    },
  },

  /**
   * Overage for each of the billable items
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
