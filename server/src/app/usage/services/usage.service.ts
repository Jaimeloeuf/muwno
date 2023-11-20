import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import dayjs from 'dayjs';

import { IMeteringService } from '../../../infra/index.js';
import { IOrgRepo, IFeedbackRepo } from '../../../DAL/index.js';

// Entity Types
import type {
  OrgID,
  ProductID,
  FeedbackResponseID,
  UserID,
  Usage,
} from 'domain-model';

// Service layer Exceptions
import { NotFoundException } from '../../../exceptions/index.js';

@Injectable()
export class UsageService {
  constructor(
    private readonly meteringService: IMeteringService,
    private readonly orgRepo: IOrgRepo,
    private readonly feedbackRepo: IFeedbackRepo,
  ) {}

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

  /**
   * Get all usage stats of the user's org.
   */
  async byOrg(userID: UserID): Promise<Usage> {
    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new NotFoundException(`User '${userID}' does not have an Org!`);

    // @todo Allow user to select time range
    const from = dayjs().subtract(1, 'month').startOf('minute').toISOString();
    const to = dayjs().startOf('minute').toISOString();

    return {
      from,
      to,

      response: await this.meteringService.queryEvent(
        'pmf_response',
        org.id,
        from,
        to,
      ),
      emailsSent: await this.meteringService.queryEvent(
        'emails_sent',
        org.id,
        from,
        to,
      ),
      responseStored: await this.feedbackRepo.getResponsesStoredForOrg(org.id),
    };
  }
}
