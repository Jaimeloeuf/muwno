import { Injectable } from '@nestjs/common';

import type { IFeedbackRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { CreateOneFeedbackResponseDTO, ProductID } from 'domain-model';

// Mappers
import { mapProductModelToEntity } from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class FeedbackRepo implements IFeedbackRepo {
  constructor(private readonly db: PrismaService) {}

  async getOne(productID: ProductID) {
    return this.db.product
      .findUnique({
        where: { id: productID },
        select: { name: true },
      })
      .then(runMapperIfNotNull(mapProductModelToEntity));
  }

  async getResponses(productID: ProductID) {
    return this.db.pmf_survey_responses.findMany({
      select: { a1: true, a2: true, a3: true, createdAt: true, a4: true },
      where: {
        productID,
      },

      // Limit up to 10 thousand rows each time
      take: 10000,
    });
  }

  async saveOne(
    productID: ProductID,
    response: CreateOneFeedbackResponseDTO,
  ): Promise<void> {
    await this.db.pmf_survey_responses.create({
      data: {
        ...response,
        productID,
      },
    });
  }
}
