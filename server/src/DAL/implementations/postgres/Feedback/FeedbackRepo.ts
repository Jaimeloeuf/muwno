import { Injectable } from '@nestjs/common';

import type {
  IFeedbackRepo,
  DBFeedbackResponse,
} from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type {
  CreateOneFeedbackResponseDTO,
  ProductID,
  FeedbackResponseID,
} from 'domain-model';

// Mappers
import {
  mapProductModelToEntity,
  mapFeedbackResponseModelToEntity,
} from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class FeedbackRepo implements IFeedbackRepo {
  constructor(private readonly db: PrismaService) {}

  async getOneFeedbackForm(productID: ProductID) {
    return this.db.product
      .findUnique({
        where: { id: productID },
        select: { name: true },
      })
      .then(runMapperIfNotNull(mapProductModelToEntity));
  }

  async saveOneResponse(
    productID: ProductID,
    response: CreateOneFeedbackResponseDTO,
  ) {
    return this.db.pmf_survey_responses
      .create({
        data: { ...response, productID },
        select: { id: true },
      })
      .then(({ id }) => id);
  }

  async getResponse(responseID: FeedbackResponseID) {
    return this.db.pmf_survey_responses
      .findUnique({ where: { id: responseID } })
      .then(runMapperIfNotNull(mapFeedbackResponseModelToEntity));
  }
  async getResponses(productID: ProductID) {
    return this.db.pmf_survey_responses.findMany({
      select: { createdAt: true, a1: true, a2: true, a3: true, a4: true },
      where: {
        productID,
      },

      // Limit up to 10 thousand rows each time
      take: 10000,

      // Type casting here is safe since only type casting a1's value from
      // number to the specific values 1, 2, 3.
    }) as Promise<Array<DBFeedbackResponse>>;
  }

  async getResponseProduct(responseID: FeedbackResponseID) {
    return this.db.pmf_survey_responses
      .findUnique({
        where: { id: responseID },
        select: {
          product: {
            select: { id: true },
          },
        },
      })
      .then(runMapperIfNotNull((response) => response.product.id));
  }
}
