import { Controller, Get, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { FeedbackService } from '../services/feedback.service.js';

import {
  GuardWithRBAC,
  AllowAllRoles,
  JWT_uid,
} from '../../../guards/index.js';

// Entity Types
import type {
  FirebaseAuthUID,
  ProductID,
  FeedbackResponseID,
  FeedbackResponse,
} from 'domain-model';

// DTO Types
import type { ReadA2WordOccurrenceDTO } from 'domain-model';

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
   * Get a Product's survey response stats.
   */
  @Get('stats/:productID')
  @AllowAllRoles
  async getResponseStats(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
  ): Promise<{ stats: number }> {
    return this.feedbackService
      .getResponseStats(requestorID, productID)
      .then((stats) => ({ stats }));
  }

  /**
   * Get a single survey response.
   */
  @Get(':responseID')
  @AllowAllRoles
  async getResponse(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('responseID') responseID: FeedbackResponseID,
  ): Promise<{ response: FeedbackResponse }> {
    return this.feedbackService
      .getResponse(requestorID, responseID)
      .then((response) => ({ response }));
  }

  /**
   * Get Product's word occurrence data for feedback response `a2` to generate
   * word cloud.
   */
  @Get('word-occurrence/:productID')
  @AllowAllRoles
  async getA2WordOccurrence(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
  ): Promise<ReadA2WordOccurrenceDTO> {
    return this.feedbackService
      .getA2WordOccurrence(requestorID, productID)
      .then((wordOccurences) => ({ wordOccurences }));
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
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
  ): Promise<string> {
    return this.feedbackService.getResponseCsvString(requestorID, productID);
  }
}
