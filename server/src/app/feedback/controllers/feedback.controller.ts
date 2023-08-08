import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { FeedbackService } from '../services/feedback.service.js';

import { GuardWithRecaptcha } from '../../../recaptcha/index.js';

// Entity Types
import type { ProductID } from 'domain-model';

// DTO Types
import type { ReadOneFeedbackFormDTO } from 'domain-model';

// DTO Validators
import { ValidatedCreateOneFeedbackResponseDTO } from '../dto-validation/ValidatedCreateOneFeedbackResponseDTO.js';

// Mappers
import { mapFeedbackFormEntityToDTO } from '../mapper/toDTOs/feedbackform.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('feedback')
@GuardWithRecaptcha()
@UseHttpControllerFilters
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * Get a Feedback Form's data.
   */
  @Get('form/:productID')
  // Skip throttle on this public API to prevent erroring on users.
  // Recaptcha will be used to gaurd this from malicious automatic DDoS.
  @SkipThrottle()
  async getForm(
    @Param('productID') productID: ProductID,
  ): Promise<ReadOneFeedbackFormDTO> {
    return this.feedbackService
      .getForm(productID)
      .then(mapFeedbackFormEntityToDTO);
  }

  /**
   * Endpoint to submit responses of a feedback form.
   */
  @Post('submit/:productID')
  // Skip throttle on this public API to prevent erroring on users.
  // Recaptcha will be used to gaurd this from malicious automatic DDoS.
  @SkipThrottle()
  async submitForm(
    @Param('productID') productID: ProductID,
    @Body() response: ValidatedCreateOneFeedbackResponseDTO,
  ) {
    this.feedbackService.saveResponse(productID, response);
  }
}
