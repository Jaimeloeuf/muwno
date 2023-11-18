import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { IMeteringService } from '../../../infra/index.js';

// Entity Types
import type { OrgID, ProductID, FeedbackResponseID } from 'domain-model';

@Injectable()
export class UsageService {
  constructor(private readonly meteringService: IMeteringService) {}

  /**
   * Track responses processed.
   */
  async trackResponse(
    orgID: OrgID,
    productID: ProductID,
    responseID: FeedbackResponseID,
  ): Promise<boolean> {
    const success = await this.meteringService.trackEvent(
      responseID,
      'pmf_response',
      orgID,
      {
        orgID,
        productID,
        responseID,
      },
    );

    return success;
  }

  /**
   * Track emails sent.
   */
  async trackEmailsSent(
    orgID: OrgID,
    productID: ProductID,
    count: number,
  ): Promise<boolean> {
    const success = await this.meteringService.trackEvent(
      ulid(),
      'emails_sent',
      orgID,
      {
        count,
        orgID,
        productID,
      },
    );

    return success;
  }
}
