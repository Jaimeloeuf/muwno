import { Controller, Get, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { FeedbackService } from '../services/feedback.service.js';

import { GuardWithRBAC, AllowAllRoles } from '../../../guards/index.js';

// Entity Types
import type {
  ProductID,
  FeedbackResponseID,
  FeedbackResponse,
} from 'domain-model';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

/**
 * Controller to define API endpoints used by portal/ subrepo, for our customers
 * to interact with their customers' PMF survey responses. This is unlike
 * `FeedbackController` which defines publicly accessibly API endpoints.
 */
@Controller('feedback/response')
@GuardWithRBAC()
@UseHttpControllerFilters
export class FeedbackResponseController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * Get survey responses as CSV string to download as a CSV file on the client.
   */
  @Get(':responseID')
  @AllowAllRoles
  async getResponse(
    @Param('responseID') responseID: FeedbackResponseID,
  ): Promise<{ response: FeedbackResponse }> {
    return this.feedbackService
      .getResponse(responseID)
      .then((response) => ({ response }));
  }

  /**
   * Get survey responses as CSV string to download as a CSV file on the client.
   */
  @Get('download/:productID')
  @AllowAllRoles
  // @todo Throttle by user/team instead of throttling by IP
  // Highly rate limited since this is an expensive DB operation
  @Throttle({ default: { limit: 3, ttl: 1000 } })
  async getResponseCsvString(
    @Param('productID') productID: ProductID,
  ): Promise<string> {
    return this.feedbackService.getResponseCsvString(productID);
  }
}
