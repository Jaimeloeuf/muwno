import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { FeedbackService } from '../services/feedback.service.js';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * Get a Feedback Form's data.
   */
  @Get('form/:formID')
  async getForm(@Param('formID') formID: string) {
    return this.feedbackService.getForm(formID);
  }

  /**
   * Endpoint to submit responses of a feedback form.
   */
  @Post('submit/:formID')
  async submitForm(
    @Param('formID') formID: string,

    // @todo Add DTO Validation
    @Body() response: any,
  ) {
    this.feedbackService.saveResponse(formID, response);

    return {};
  }
}
