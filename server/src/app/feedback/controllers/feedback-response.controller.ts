import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
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
import type { ReadOccurrenceMapDTO, ReadManyA3DTO } from 'domain-model';

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
   * Get Product's term occurrence data for feedback response `a2`.
   */
  @Get('term-occurrence/a2/:productID')
  @AllowAllRoles
  async getA2TermOccurrence(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
    @Query('timeRange', ParseIntPipe) timeRange: number,
  ): Promise<ReadOccurrenceMapDTO> {
    return this.feedbackService
      .getA2TermOccurrence(requestorID, productID, timeRange)
      .then((occurrence) => ({ occurrence }));
  }

  /**
   * Get Product's word occurrence data for feedback response `a2`.
   */
  @Get('word-occurrence/a2/:productID')
  @AllowAllRoles
  async getA2WordOccurrence(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
    @Query('timeRange', ParseIntPipe) timeRange: number,
  ): Promise<ReadOccurrenceMapDTO> {
    return this.feedbackService
      .getA2WordOccurrence(requestorID, productID, timeRange)
      .then((occurrence) => ({ occurrence }));
  }

  /**
   * Get Product's word occurrence data for feedback response `a3`.
   */
  @Get('word-occurrence/a3/:productID')
  @AllowAllRoles
  async getA3WordOccurrence(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
    @Query('timeRange', ParseIntPipe) timeRange: number,
  ): Promise<ReadOccurrenceMapDTO> {
    return this.feedbackService
      .getA3WordOccurrence(requestorID, productID, timeRange)
      .then((occurrence) => ({ occurrence }));
  }

  /**
   * Get Product's feedback response `a3`.
   */
  @Get('a3/:productID')
  @AllowAllRoles
  async getA3(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
    @Query('count', ParseIntPipe) count: number,
    @Query('paginationID') optionalPaginationID?: FeedbackResponseID,
  ): Promise<ReadManyA3DTO> {
    // Must be within +/-15 since negative values are used to paginate backwards
    if (count > 15 || count < -15)
      throw new BadRequestException(
        `Cannot request for more than 15 responses at a time. Requested for ${count}`,
      );

    return this.feedbackService
      .getA3(requestorID, productID, count, optionalPaginationID)
      .then((benefits) => ({ benefits }));
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
