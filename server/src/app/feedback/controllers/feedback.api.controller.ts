import { Controller, Param, Post, Body } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { IProductRepo } from '../../../DAL/index.js';
import { FeedbackService } from '../services/feedback.service.js';

import { GuardWithApiKey, ApiKeyOrg } from '../../../guards/apikey/index.js';

// Entity Types
import type { Org, ProductID } from 'domain-model';

// DTO Validators
import { ValidatedCreateOneFeedbackResponseDTO } from '../dto-validation/ValidatedCreateOneFeedbackResponseDTO.js';

// Service layer Exceptions
import {
  NotFoundException,
  ForbiddenException,
} from '../../../exceptions/index.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('api/feedback')
@GuardWithApiKey()
@SkipThrottle()
@UseHttpControllerFilters
export class FeedbackApiController {
  constructor(
    private readonly productRepo: IProductRepo,
    private readonly feedbackService: FeedbackService,
  ) {}

  /**
   * Endpoint to submit responses of a feedback form.
   */
  @Post('submit/:productID')
  async submitForm(
    @ApiKeyOrg() org: Org,
    @Param('productID') productID: ProductID,
    @Body() response: ValidatedCreateOneFeedbackResponseDTO,
  ) {
    const orgID = await this.productRepo.getProductOrg(productID);
    if (orgID === null)
      throw new NotFoundException(`Product ${productID} does not exist`);

    if (orgID !== org.id)
      throw new ForbiddenException(
        `Product ${productID} does not belong to the API key's Org`,
      );

    await this.feedbackService.saveResponse(productID, response);
  }
}
