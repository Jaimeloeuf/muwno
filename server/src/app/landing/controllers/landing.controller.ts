import { Controller, Post, Body } from '@nestjs/common';

import { GuardWithRecaptcha } from '../../../guards/index.js';

import { IAdminNotifService } from '../../../infra/index.js';

// DTO Validators
import { ValidatedContactFormDetailsDTO } from '../dto-validation/ValidatedContactFormDetailsDTO.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

// Utils
import { landingPageContactFormNotifBuilder } from '../../../utils/index.js';

@Controller('landing')
@GuardWithRecaptcha()
@UseHttpControllerFilters
export class LandingController {
  constructor(private readonly adminNotifService: IAdminNotifService) {}

  /**
   * API Endpoint for contact us form submission from landing page.
   */
  @Post('contact-form/submit')
  async createUser(@Body() details: ValidatedContactFormDetailsDTO) {
    await this.adminNotifService.send(
      landingPageContactFormNotifBuilder(details),
    );

    // Return empty object so that client can parse as JSON
    return {};
  }
}
