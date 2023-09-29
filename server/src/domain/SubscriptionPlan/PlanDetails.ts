/**
 * Hardcoded plan details object since there is only 1 plan now.
 */
export const PlanDetails = <const>{
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
        SGD: 0.05,
      },
    },

    email: {
      price: {
        SGD: 0.004,
      },
    },

    responseStored: {
      price: {
        SGD: 0.01,
      },
    },

    customerStored: {
      price: {
        SGD: 0.01,
      },
    },
  },
};
