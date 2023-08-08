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

  async PMFLiveScore(productID: ProductID) {
    // @todo To fix
    const startOfSprintWindow = new Date(
      new Date().getTime() - 6.048e8,
    ).toISOString();

    // Select all the responses submitted during the rolling sprint window.
    // Group by a1 and count how many in each group.
    const responses = await this.db.pmf_survey_responses.groupBy({
      by: ['a1'],
      _count: { a1: true },
      where: {
        productID,
        createdAt: { gte: startOfSprintWindow },
      },
    });

    // If there are no survey responses in the rolling window, return nothing.
    if (responses.length === 0) return null;

    // Use a tuple and prefill them with 0 to prevent type errors, while also
    // ensuring that unselected options will not be left empty.
    const votesByCategory: PMFScore['votesByCategory'] = { 1: 0, 2: 0, 3: 0 };
    let totalResponses = 0;
    for (const response of responses) {
      // Casting without runtime check since assuming that it is validated on DB write.
      votesByCategory[response.a1 as keyof PMFScore['votesByCategory']] =
        response._count.a1;

      totalResponses += response._count.a1;
    }

    return {
      startOfSprintWindow,
      votesByCategory,
      totalResponses,
      currentPMFScore: Math.trunc((votesByCategory[3] / totalResponses) * 100),
    };
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

    // @todo This might be changed to return null to indicate no response.
    // If there are no survey responses in the sprint, do nothing, and allow it
    // to be treated as a time period of zero for the PMF score.
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
      score: Math.trunc((votesByCategory[3] / totalResponses) * 100),
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
