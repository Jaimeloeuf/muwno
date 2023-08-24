import { Injectable } from '@nestjs/common';

import { IPlanRepo, IOrgRepo } from '../../../DAL/index.js';
import { StripeService } from './stripe.service.js';

// Entity Types
import type { Plan, UserID, OrgID } from 'domain-model';

// Exceptions
import { InvalidInternalStateException } from '../../../exceptions/index.js';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly planRepo: IPlanRepo,
    private readonly orgRepo: IOrgRepo,
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
    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new InvalidInternalStateException(
        `User '${userID}' cannot checkout as they do not have an Org`,
      );

    // @todo track the user's request using their ID

    return this.stripeService.createCheckoutSession(planID, org);
  }

  /**
   * Create a new Stripe Billing Portal Session and get back the session's URL
   * string for client to redirect to.
   */
  async createPortalSession(userID: UserID): Promise<string> {
    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new InvalidInternalStateException(
        `User '${userID}' cannot access portal as they do not have an Org`,
      );

    // @todo track the user's request using their ID

    return this.stripeService.createPortalSession(org.id);
  }
}
