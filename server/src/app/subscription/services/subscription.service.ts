import { Injectable } from '@nestjs/common';

import { StripeService } from './stripe.service.js';

// Entity Types
import type { Plan, UserID } from 'domain-model';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly planRepo: IPlanRepo,
    private readonly stripeService: StripeService,
  ) {}

  async getPlans(): Promise<Array<Plan>> {
    return this.planRepo.getActive();
  }

  /**
   * Create a new Stripe Checkout Session and get back the session's URL string
   * for client to redirect to.
   */
  async createCheckoutSession(userID: UserID, planID: string): Promise<string> {
    // @todo track the user's request using their ID
    userID;

    return this.stripeService.createCheckoutSession(planID);
  }

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   */
  async createPortalSession(userID: UserID): Promise<string> {
    // @todo track the user's request using their ID
    userID;

    return this.stripeService.createPortalSession(userID);
  }
}
