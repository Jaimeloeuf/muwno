import { Injectable } from '@nestjs/common';

import { StripeClient } from '../infra/stripe-client.js';
import { IStripeCustomerRepo } from '../../../DAL/index.js';

// Service layer Exceptions
import { InvalidInputException } from '../../../exceptions/index.js';

// Utils
import { unixSecondsToIsoString } from '../../../utils/index.js';

@Injectable()
export class StripeSubscriptionService {
  constructor(
    private readonly stripe: StripeClient,
    private readonly stripeCustomerRepo: IStripeCustomerRepo,
  ) {}

  /**
   * Check if a given Stripe coupon is valid.
   */
  async checkCouponValidity(couponID: string) {
    try {
      // This will throw an error if coupon is not found
      const coupon = await this.stripe.coupons.retrieve(couponID);

      // If coupon found but not valid, throw error to indicate coupon invalid
      if (!coupon.valid) throw new Error('Invalid coupon');

      return { valid: true };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Get current billing period timestamps (ISO Date Time String) of an Org's
   * metered product.
   */
  async getCurrentPeriodOfMeteredSubscription(orgID: string) {
    const customer = await this.stripeCustomerRepo.getCustomerWithOrgID(orgID);
    if (customer === null)
      throw new InvalidInputException(
        `Cannot read metered product subscription period as Org ${orgID} does not have a Stripe Account`,
      );
    if (customer.meteredSubscriptionID === null)
      throw new Error(
        `Cannot read metered product subscription period as Org ${orgID} does not have a metered subscription`,
      );

    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      customer.meteredSubscriptionID,
    );

    return {
      from: unixSecondsToIsoString(stripeSubscription.current_period_start),
      to: unixSecondsToIsoString(stripeSubscription.current_period_end),
    };
  }
}
