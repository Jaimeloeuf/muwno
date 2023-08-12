import { Injectable } from '@nestjs/common';

import type { IProductRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type {
  OrgID,
  UserID,
  ProductID,
  CreateOneProductDTO,
  MIT,
  PMFScore,
} from 'domain-model';

// Mappers
import {
  mapProductModelToEntity,
  mapProductModelsToEntity,
  mapMITModelsToEntity,
} from './mapper.js';

@Injectable()
export class ProductRepo implements IProductRepo {
  constructor(private readonly db: PrismaService) {}

  async productExists(productID: ProductID) {
    return this.db.product
      .findUnique({
        where: { id: productID },
        select: { iid: true }, // Select as little as possible for efficiency
      })
      .then((product) => product !== null);
  }

  async getOrgProducts(orgID: OrgID) {
    return this.db.product
      .findMany({ where: { orgID }, orderBy: { createdAt: 'asc' } })
      .then(mapProductModelsToEntity);
  }

  async getUserOrgProducts(userID: UserID) {
    return (
      this.db.user
        .findUnique({
          where: { id: userID },
          select: {
            org: {
              select: {
                product: {
                  orderBy: { createdAt: 'asc' },
                },
              },
            },
          },
        })
        // Default to an empty array to denote Org with no products
        .then((user) => mapProductModelsToEntity(user?.org?.product ?? []))
    );
  }

  async createOne(orgID: OrgID, createOneProductDTO: CreateOneProductDTO) {
    return this.db.product
      .create({ data: { ...createOneProductDTO, orgID } })
      .then(mapProductModelToEntity);
  }

  async PMFScoreOfPeriod(productID: ProductID, start: string, end: string) {
    // Select all responses submitted during the given time period.
    // Group by a1 and count how many in each group.
    const responses = await this.db.pmf_survey_responses.groupBy({
      by: ['a1'],
      _count: { a1: true },
      where: {
        AND: [
          { productID },
          { createdAt: { gte: start } }, // Start of period
          { createdAt: { lt: end } }, // End of period
        ],
      },
    });

    // If there are no survey responses in the time window, DO NOTHING, and
    // allow it to be treated as a time period of null PMF score when computing
    // it later instead of returning null directly now. This is so that the
    // return type is always uniformly typeof `PMFScore` so it is easier to use
    // for the API users, especially since it comes with the time window too.
    // if (responses.length === 0) return null;

    // Prefill with 0 to ensure that unselected options will not be left empty.
    const votesByCategory: PMFScore['votesByCategory'] = { 1: 0, 2: 0, 3: 0 };
    let totalResponses = 0;
    for (const response of responses) {
      // Casting without runtime check since assuming that it is validated on DB write.
      votesByCategory[response.a1 as keyof PMFScore['votesByCategory']] =
        response._count.a1;

      totalResponses += response._count.a1;
    }

    return {
      timeWindow: { start, end },
      votesByCategory,
      totalResponses,

      /**
       * If `totalResponses` is 0, can just return null directly, because
       * computing a score when that is 0 will only have 2 possible outcomes.
       *
       * 1. A possible state, and the most likely thing to happen.
       *    - `votesByCategory[3]` is 0
       *    - dividing 0 by 0 will return NaN which will be converted to null on
       *      JSON serialisation when returning the data to API user.
       * 2. Impossible state
       *    - `votesByCategory[3]` is more than 1, this is impossible since
       *      `totalResponses` is computed by summing all the votes up.
       *    - dividing by 0 when will cause Infinity, which will be converted to
       *      null on JSON serialisation when returning the data to API user.
       *
       * Since both will eventually be converted to null, there is no need in
       * doing the computation in the first place, just use null directly.
       */
      score:
        totalResponses === 0
          ? null
          : Math.trunc((votesByCategory[3] / totalResponses) * 100),
    };
  }

  async currentMIT(productID: ProductID) {
    return this.db.mit
      .findMany({
        where: {
          productID,
          done: false,
        },
        // @todo Sort by points system too
        orderBy: { createdAt: 'desc' },
        take: 3,
      })
      .then(mapMITModelsToEntity);
  }

  async markTaskAsDone(mitID: MIT['id']) {
    const { productID } = await this.db.mit.update({
      where: { id: mitID },
      data: { done: true },

      // Get the productID back to return back a new list of current MITs
      select: { productID: true },
    });

    return this.currentMIT(productID);
  }
}
