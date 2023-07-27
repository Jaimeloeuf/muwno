import { Injectable } from '@nestjs/common';

import type { IProductRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { Org, Product, CreateOneProductDTO } from 'domain-model';

// Mappers
import { mapProductModelToEntity, mapMITModelsToEntity } from './mapper.js';

@Injectable()
export class ProductRepo implements IProductRepo {
  constructor(private readonly db: PrismaService) {}

  async productExists(productID: Product['id']) {
    return this.db.product
      .findUnique({
        where: { id: productID },
        select: { iid: true }, // Select as little as possible for efficiency
      })
      .then((product) => product !== null);
  }

  async getOrgProducts(orgID: Org['id']) {
    return this.db.product
      .findMany({ where: { orgID } })
      .then(mapProductModelToEntity);
  }

  async createOne(orgID: Org['id'], createOneProductDTO: CreateOneProductDTO) {
    return (
      this.db.product
        .create({
          data: {
            // ...createOneProductDTO,
            name: createOneProductDTO.name,
            orgID,

            // @todo Tmp to remove
            daysPerSprint: 1,
            firstSprint: new Date(),
          },
        })
        // @todo Fix the type and add a mapper
        .then((a) => a as unknown as Product)
    );
  }

  async PMFLiveScore(productID: Product['id']) {
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
    const votesByCategory: [number, number, number] = [0, 0, 0];
    let totalResponses = 0;
    for (const response of responses) {
      votesByCategory[response.a1] = response._count.a1;
      totalResponses += response._count.a1;
    }

    return {
      startOfSprintWindow,
      votesByCategory,
      totalResponses,
      currentPMFScore: Math.trunc((votesByCategory[0] / totalResponses) * 100),
    };
  }

  async PMFScoreOfPeriod(productID: Product['id'], start: string, end: string) {
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

    // Use a tuple and prefill them with 0 to prevent type errors, while also
    // ensuring that unselected options will not be left empty.
    const votesByCategory: [number, number, number] = [0, 0, 0];
    let totalResponses = 0;
    for (const response of responses) {
      votesByCategory[response.a1] = response._count.a1;
      totalResponses += response._count.a1;
    }

    return {
      timeWindow: { start, end },
      votesByCategory,
      totalResponses,
      score: Math.trunc((votesByCategory[0] / totalResponses) * 100),
    };
  }

  async currentMIT(productID: Product['id']) {
    // @todo To fix
    const startOfSprintWindow = new Date(
      new Date().getTime() - 6.048e8,
    ).toISOString();

    return this.db.mit
      .findMany({
        where: {
          productID,
          createdAt: { gte: startOfSprintWindow },
          done: false,
        },
        orderBy: { createdAt: 'desc' },
      })
      .then(mapMITModelsToEntity);
  }
}
