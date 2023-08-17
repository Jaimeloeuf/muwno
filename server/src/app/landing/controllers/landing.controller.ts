import { Controller, Post, Body } from '@nestjs/common';

import { GuardWithRecaptcha } from '../../../recaptcha/index.js';

import { ITelegramBotService } from '../../../infra/abstractions/index.js';

// DTO Validators
import { ValidatedContactFormDetailsDTO } from '../dto-validation/ValidatedContactFormDetailsDTO.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('landing')
@GuardWithRecaptcha()
@UseHttpControllerFilters
export class LandingController {
  constructor(private readonly telegramBotService: ITelegramBotService) {}

  /**
   * API Endpoint for contact us form submission from landing page.
   */
  @Post('contact-form/submit')
  async createUser(@Body() details: ValidatedContactFormDetailsDTO) {
    await this.telegramBotService.notifyAdmin(
      `<b>ContactForm</b>
Name: ${details.name}
Email: ${details.email}
Message: ${details.message}`,
    );

    // Return empty object so that client can parse as JSON
    return {};
  }
}
