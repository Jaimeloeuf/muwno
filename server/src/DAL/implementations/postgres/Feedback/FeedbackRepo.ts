import { Injectable } from '@nestjs/common';

import type { IFeedbackRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { FeedbackResponse, Product } from 'domain-model';

// Mappers
import { mapProductModelToEntity } from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class FeedbackRepo implements IFeedbackRepo {
  constructor(private readonly db: PrismaService) {}

  async getOne(productID: Product['id']) {
    return this.db.product
      .findUnique({
        where: { id: productID },
        select: { name: true },
      })
      .then(runMapperIfNotNull(mapProductModelToEntity));
  }

  async saveOne(
    productID: Product['id'],
    response: FeedbackResponse,
  ): Promise<void> {
    await this.db.pmf_survey_responses.create({
      data: {
        productID,
        ...response,
      },
    });
  }
}
