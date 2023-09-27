import { Injectable, Logger } from '@nestjs/common';
import type { Stripe } from 'stripe';

import { StripeClient } from '../infra/stripe.infra.js';

// Exceptions
import { InvalidInternalStateException } from '../../../exceptions/index.js';

@Injectable()
export class StripeBuySubscriptionService {
  constructor(
    private readonly logger: Logger,
    private readonly stripe: StripeClient,
  ) {}

  /**
   * Buy subscription plans for new customer using their default payment method.
   *
   * Why 2 separate subscriptions?
   * - To make it easier to handle different subscription interval types and to
   *   make it more uniform when handling the logic instead of having monthly
   *   subscriptions hold both Standard Product and Metered Products which makes
   *   it more complex to handle and makes dealing with coupons more difficult.
   * - See commit 0d217dc8b87a9f1fa8858839c16571ed662d6809
   * - https://support.stripe.com/questions/does-stripe-send-receipts-for-0-invoices
   * - https://support.stripe.com/questions/why-did-stripe-not-send-an-email-receipt-for-my-successfully-paid-invoice
   */
  async buySubscription(
    stripeCustomerID: string,
    paymentInterval: 'yearly' | 'monthly',
    coupon: null | string,
  ) {
    await this.buyStandardSubscription(
      stripeCustomerID,
      paymentInterval,
      coupon,
    );

    await this.buyMeteredSubscription(stripeCustomerID);
  }

  /**
   * Thin utility method wrapper around Stripe's create subscription method.
   *
   * Creates a new Stripe Subscription for the given Customer and Items, and pay
   * using the Customer's default payment method (must be available else throws)
   * in `off_session` mode (needs to be setup first).
   */
  private async createSubsciption(
    stripeCustomerID: string,
    items: Stripe.SubscriptionCreateParams.Item[],
    coupon: null | string,
  ) {
    const subscriptionOptions = {
      // Subscription will be paid with customer's default payment method,
      // therefore they must have one attached else this will fail.
      customer: stripeCustomerID,

      // This is needed to indicate this is a Merchant Initiated Transaction.
      off_session: true,

      items,

      // @todo
      // Test this as stripe docs suggested this for first payment failure due
      // to customer action required
      // payment_behavior: 'allow_incomplete',
    } satisfies Stripe.SubscriptionCreateParams;

    return this.stripe.subscriptions.create(
      coupon === null
        ? subscriptionOptions
        : { ...subscriptionOptions, coupon },
    );
  }

  /**
   * Get the subscription item object for the Standard Subscription product's
   * Stripe Price based on the payment interval.
   */
  private async getStandardProductPrice(paymentInterval: 'yearly' | 'monthly') {
    const standardProductLookupKey =
      paymentInterval === 'yearly' ? 'standard-yearly' : 'standard-monthly';

    const { data } = await this.stripe.prices.list({
      lookup_keys: [standardProductLookupKey],
    });

    const priceID = data[0]?.id;

    // Throw error if no priceID found for the given lookup key and Stripe did
    // not throw, since Stripe will throw if not found.
    if (priceID === undefined)
      throw new InvalidInternalStateException(
        `Stripe PriceID for '${standardProductLookupKey}' not found`,
      );

    return {
      price: priceID,

      // Quantity is fixed to 1 as user subscribes to Standard product once.
      quantity: 1,
    };
  }

  private async buyStandardSubscription(
    stripeCustomerID: string,
    paymentInterval: 'yearly' | 'monthly',
    coupon: null | string,
  ) {
    const standardProductPrice = await this.getStandardProductPrice(
      paymentInterval,
    );

    const standardProductSubscription = await this.createSubsciption(
      stripeCustomerID,
      [standardProductPrice],
      coupon,
    );

    // @todo
    // This might happen if 3DS requires user action and subscription cannot
    // complete, need to use `standardProductSubscription.pending_setup_intent`
    if (standardProductSubscription.status !== 'active')
      throw new Error(
        `Subscription '${standardProductSubscription.id}' did not succeed: '${standardProductSubscription.status}'`,
      );

    // @todo Save subscription ID instead of calling Stripe API on future use
    this.logger.verbose(
      `Created subscription: 'Standard' - ${standardProductSubscription.id}`,
      StripeBuySubscriptionService.name,
    );
  }

  /**
   * Utility method to get subscription item array of all Usage Metered
   * Products' Stripe Price.
   *
   * Returned objects do not have `quantity` value set since prices using
   * metered usage billing should not have a fixed quantity set.
   */
  private getMeteredProductPrice() {
    return this.stripe.prices
      .list({ lookup_keys: ['response-usage', 'email-usage'] })
      .then(({ data }) => data.map((price) => ({ price: price.id })));
  }

  private async buyMeteredSubscription(stripeCustomerID: string) {
    const meteredProductPrice = await this.getMeteredProductPrice();

    const meteredProductSubscription = await this.createSubsciption(
      stripeCustomerID,
      meteredProductPrice,

      // Coupon only applies to the 'Standard' product so this is always null
      null,
    );

    // @todo
    // This might happen if 3DS requires user action and subscription cannot
    // complete, need to use `meteredProductSubscription.pending_setup_intent`
    if (meteredProductSubscription.status !== 'active')
      throw new Error(
        `Subscription '${meteredProductSubscription.id}' did not succeed: '${meteredProductSubscription.status}'`,
      );

    // @todo Save subscription ID instead of calling Stripe API on future use
    this.logger.verbose(
      `Created subscription: 'Metered' - ${meteredProductSubscription.id}`,
      StripeBuySubscriptionService.name,
    );
  }
}
