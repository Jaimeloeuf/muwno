import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { FeedbackService } from '../services/feedback.service.js';

// DTO Types
import type {
  ReadOneFeedbackFormDTO,
  CreateOneFeedbackResponseDTO,
} from 'domain-model';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * Get a Feedback Form's data.
   */
  @Get('form/:formID')
  async getForm(
    @Param('formID') formID: string,
  ): Promise<ReadOneFeedbackFormDTO> {
    return this.feedbackService
      .getForm(formID)
      .then(mapFeedbackFormEntityToDTO);
  }

  /**
   * Endpoint to submit responses of a feedback form.
   */
  @Post('submit/:formID')
  async submitForm(
    @Param('formID') formID: string,

    // @todo Add DTO Validation
    @Body() response: CreateOneFeedbackResponseDTO,
  ) {
    this.feedbackService.saveResponse(formID, response.response);

    return {};
  }
}
