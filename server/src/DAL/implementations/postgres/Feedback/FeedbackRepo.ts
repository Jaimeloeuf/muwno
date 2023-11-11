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
    id: string,
    product_id: ProductID,
    response: CreateOneFeedbackResponseDTO,
  ) {
    return this.db.pmf_survey_response
      .create({
        data: { ...response, id, product_id },
        select: { id: true },
      })
      .then(({ id }) => id);
  }

  async getResponseStats(productID: ProductID) {
    return this.db.pmf_survey_response.count({
      where: { product_id: productID },
    });
  }

  async getResponse(responseID: FeedbackResponseID) {
    return this.db.pmf_survey_response
      .findUnique({ where: { id: responseID } })
      .then(runMapperIfNotNull(mapFeedbackResponseModelToEntity));
  }

  async getResponseA2(product_id: ProductID) {
    return this.db.pmf_survey_response
      .findMany({
        // Only load the "People that would benefit from Product" answer
        select: { a2: true },

        where: {
          product_id,

          // @todo Should this filtering be done at DB level or compute level?
          a2: { not: '' },
        },

        // Sort by importance and oldest first.
        orderBy: [{ a1: 'desc' }, { created_at: 'asc' }],

        // Up to 1000 responses, @todo might make this number smaller
        take: 1000,
      })
      .then((responses) => responses.map((response) => response.a2));
  }

  async getResponses(product_id: ProductID) {
    return this.db.pmf_survey_response.findMany({
      select: { created_at: true, a1: true, a2: true, a3: true, a4: true },
      where: {
        product_id,
      },

      // Limit up to 1 thousand rows each time
      take: 1000,

      // Type casting here is safe since only type casting a1's value from
      // number to the specific values 1, 2, 3.
    }) as Promise<Array<DBFeedbackResponse>>;
  }

  async getResponseProduct(responseID: FeedbackResponseID) {
    return this.db.pmf_survey_response
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
