import { Injectable } from '@nestjs/common';

import { ProductService } from '../../product/services/product.service.js';
import { IEmailBlastService } from '../../../infra/index.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

// Entity Types
import type { UserID, ProductID } from 'domain-model';

// DTO Types
import type { CreateManualEmailBlastDTO } from 'domain-model';

// Utils
import { surveyBlastEmailBuilder } from '../../../utils/index.js';

@Injectable()
export class SurveyMethodManualEmailBlastService {
  /**
   * Survey form's root link read from env var.
   */
  private readonly FORM_LINK: string;

  constructor(
    configService: ConfigService<EnvironmentVariables, true>,
    private readonly productService: ProductService,
    private readonly emailBlastService: IEmailBlastService,
  ) {
    this.FORM_LINK = configService.get('FORM_LINK', { infer: true });
  }

  /**
   * Send an email blast to survey customers about the selected product.
   */
  async send(
    requestorID: UserID,
    productID: ProductID,
    createManualEmailBlastDTO: CreateManualEmailBlastDTO,
  ): Promise<unknown> {
    const product = await this.productService.getProduct(
      requestorID,
      productID,
    );

    const surveyLink = `${this.FORM_LINK}/#/feedback/${product.id}`;

    const emailMessages = createManualEmailBlastDTO.customers.map(
      (customerContactDetails) => ({
        to: customerContactDetails.email,
        subject: surveyBlastEmailBuilder.subject(
          customerContactDetails.name,
          product.name,
        ),
        body: surveyBlastEmailBuilder.body(
          customerContactDetails.name,
          product.name,
          surveyLink,
        ),
      }),
    );

    const success = await this.emailBlastService.sendBatch(emailMessages);

    return { success };
  }
}
