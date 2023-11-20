import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

import type {
  IFeedbackRepo,
  DBFeedbackResponse,
} from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type {
  CreateOneFeedbackResponseDTO,
  ProductID,
  FeedbackResponseID,
  OrgID,
} from 'domain-model';

// Mappers
import {
  mapProductModelToEntity,
  mapFeedbackResponseModelToEntity,
} from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';
import { optionallyPaginateWithCursor } from '../utils/optionallyPaginateWithCursor.js';

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

  async getResponsesStoredForOrg(org_id: OrgID) {
    const productIDs = await this.db.product
      .findMany({ where: { org_id } })
      .then((products) => products.map((product) => product.id));

    return this.db.pmf_survey_response.count({
      where: {
        product_id: { in: productIDs },
      },
    });
  }

  // @todo Alternatively it could be this since stats will also contain other data.
  // async getResponsesStoredForProduct(product_id: ProductID) {
  //   return this.db.pmf_survey_response.count({
  //     where: { product_id },
  //   });
  // }
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

  async getResponseA2(product_id: ProductID, timeRange: number) {
    return this.db.pmf_survey_response
      .findMany({
        // Only load the "People that would benefit from Product" answer
        select: { a2: true },

        where: {
          product_id,

          created_at:
            timeRange === 0
              ? {} // 0 means no filtering.
              : // Filter for today to (today - timeRange seconds)
                { gt: dayjs().subtract(timeRange, 'seconds').toISOString() },

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

  async getResponseA3(product_id: ProductID, timeRange: number) {
    return this.db.pmf_survey_response
      .findMany({
        // Only load the "Main benefit of Product" answer
        select: { a3: true },

        where: {
          product_id,

          created_at:
            timeRange === 0
              ? {} // 0 means no filtering.
              : // Filter for today to (today - timeRange seconds)
                { gt: dayjs().subtract(timeRange, 'seconds').toISOString() },

          // @todo Should this filtering be done at DB level or compute level?
          a3: { not: '' },
        },

        // Sort by importance and oldest first.
        orderBy: [{ a1: 'desc' }, { created_at: 'asc' }],

        // Up to 1000 responses, @todo might make this number smaller
        take: 1000,
      })
      .then((responses) => responses.map((response) => response.a3));
  }

  async getA3(
    product_id: ProductID,
    take: number,
    optionalPaginationID?: FeedbackResponseID,
  ) {
    const queryArgs = {
      select: { id: true, a3: true },

      where: {
        product_id,
        a3: { not: '' },
      },

      // Sort by highest score and newest first.
      orderBy: [
        { a1: 'desc' },

        // Get the newest response first so the benefits list will always show
        // the latest customer feedbacks.
        { created_at: 'desc' },
      ],

      take,
    } satisfies Prisma.pmf_survey_responseFindManyArgs;

    return this.db.pmf_survey_response.findMany(
      optionallyPaginateWithCursor(optionalPaginationID, queryArgs, {
        id: optionalPaginationID,
      }),
    );
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
