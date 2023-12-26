import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import dayjs from 'dayjs';

import { StripeSubscriptionService } from '../../stripe/services/subscription.service.js';
import { IMeteringService } from '../../../infra/index.js';
import { IOrgRepo, IFeedbackRepo } from '../../../DAL/index.js';

// Entity Types
import type {
  OrgID,
  ProductID,
  FeedbackResponseID,
  UserID,
  Usage,
  ISODateTimeString,
} from 'domain-model';

// Service layer Exceptions
import {
  NotFoundException,
  InvalidInputException,
} from '../../../exceptions/index.js';

@Injectable()
export class UsageService {
  constructor(
    private readonly stripeSubscriptionService: StripeSubscriptionService,
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
   * Track max responses stored.
   */
  async trackResponseStored(
    orgID: OrgID,
    productID: ProductID,
    // @todo make optional, since deleting responses should also trigger this method
    responseID: FeedbackResponseID,
  ): Promise<boolean> {
    const count = await this.feedbackRepo.getResponsesStoredForOrg(orgID);

    const success = await this.meteringService.trackEvent(
      // Using responseID as event ID since this is the response that triggered
      // the update for storage count.
      responseID,
      'pmf_response_stored',
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
   * Get usage stats of the user's org in the current billing period.
   */
  async getStatsByOrgOfCurrentBillingPeriod(userID: UserID): Promise<Usage> {
    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new NotFoundException(`User '${userID}' does not have an Org!`);

    const { from, to } =
      await this.stripeSubscriptionService.getCurrentPeriodOfMeteredSubscription(
        org.id,
      );

    return this.getStatsByOrg(
      org.id,

      // Round time to nearest minute as metering service can only aggregate up
      // to the nearest minute.
      dayjs(from).startOf('minute').toISOString(),
      dayjs(to).startOf('minute').toISOString(),
    );
  }

  /**
   * Get all usage stats of the user's org.
   */
  async getStatsByOrgOfSelectedTimeRange(
    userID: UserID,
    timeRange: number,
  ): Promise<Usage> {
    if (timeRange > 2.592e6)
      throw new InvalidInputException(
        `Time range cannot be larger than 2.592e6`,
      );

    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new NotFoundException(`User '${userID}' does not have an Org!`);

    const from = dayjs()
      .subtract(timeRange, 'seconds')
      .startOf('minute')
      .toISOString();
    const to = dayjs().startOf('minute').toISOString();

    return this.getStatsByOrg(org.id, from, to);
  }

  /**
   * Get all usage stats of an org in the selected time period.
   */
  private async getStatsByOrg(
    orgID: OrgID,
    from: ISODateTimeString,
    to: ISODateTimeString,
  ): Promise<Usage> {
    return {
      from,
      to,

      response: await this.meteringService.queryEvent(
        'pmf_response',
        orgID,
        from,
        to,
      ),
      emailsSent: await this.meteringService.queryEvent(
        'emails_sent',
        orgID,
        from,
        to,
      ),
      responseStored: {
        current: await this.feedbackRepo.getResponsesStoredForOrg(orgID),
        max: await this.meteringService.queryEvent(
          'pmf_response_stored',
          orgID,
          from,
          to,
        ),
      },
    };
  }
}
