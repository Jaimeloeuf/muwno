import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { FeedbackService } from '../services/feedback.service.js';

import { GuardWithRecaptcha } from '../../../guards/index.js';

// Entity Types
import type { ProductID } from 'domain-model';

// DTO Types
import type { ReadOneFeedbackFormDTO } from 'domain-model';

// DTO Validators
import { ValidatedCreateOneFeedbackResponseDTO } from '../dto-validation/ValidatedCreateOneFeedbackResponseDTO.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

/**
 * Controller to define API endpoints used by form/ subrepo, to load the
 * feedback form and save the user's response. These endpoints are accessible
 * without any RBAC protection since it is used by public users, therefore these
 * are protected with recaptcha.
 *
 * The throttler / rate-limiter is also skipped on this public API to prevent
 * erroring on users, and it will be fine since Recaptcha will be used to gaurd
 * this from malicious automatic DDoS.
 */
@Controller('feedback')
@GuardWithRecaptcha()
@SkipThrottle()
@UseHttpControllerFilters
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * Get a Feedback Form's data.
   */
  @Get('form/:productID')
  async getForm(
    @Param('productID') productID: ProductID,
  ): Promise<ReadOneFeedbackFormDTO> {
    return this.feedbackService.getForm(productID).then((form) => ({ form }));
  }

  /**
   * Endpoint to submit responses of a feedback form.
   */
  @Post('submit/:productID')
  async submitForm(
    @Param('productID') productID: ProductID,
    @Body() response: ValidatedCreateOneFeedbackResponseDTO,
  ) {
    await this.feedbackService.saveResponse(productID, response);
  }
}
