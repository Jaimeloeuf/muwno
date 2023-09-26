import { Injectable } from '@nestjs/common';

import { Stripe } from '../infra/stripe.infra.js';

@Injectable()
export class StripeSubscriptionService {
  constructor(private readonly stripe: Stripe) {}

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
}
