import { Controller, Post, Param, Body } from '@nestjs/common';

import { SurveyMethodManualEmailBlastService } from '../services/email-manual.service.js';

import {
  GuardWithRBAC,
  AllowAllRoles,
  JWT_uid,
} from '../../../guards/index.js';

// Entity Types
import type { FirebaseAuthUID, ProductID } from 'domain-model';

// DTO Validators
import { ValidatedCreateManualEmailBlastDTO } from '../dto-validation/ValidatedCreateManualEmailBlastDTO.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('survey-method/email/manual')
@GuardWithRBAC()
@UseHttpControllerFilters
export class SurveyMethodManualEmailBlastController {
  constructor(
    private readonly surveyMethodManualEmailBlastService: SurveyMethodManualEmailBlastService,
  ) {}

  /**
   * Send an email blast to survey customers about the selected product.
   */
  @Post('blast/:productID')
  @AllowAllRoles
  async sendEmailBlast(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
    @Body()
    validatedCreateManualEmailBlastDTO: ValidatedCreateManualEmailBlastDTO,
  ): Promise<unknown> {
    return this.surveyMethodManualEmailBlastService.send(
      requestorID,
      productID,
      validatedCreateManualEmailBlastDTO,
    );
  }
}
