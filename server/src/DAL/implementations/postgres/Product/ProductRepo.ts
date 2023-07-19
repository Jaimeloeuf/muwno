import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import type { IProductRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { Org, Product } from 'domain-model';

// Mappers
import { mapProductModelToEntity, mapMITModelsToEntity } from './mapper.js';

@Injectable()
export class ProductRepo implements IProductRepo {
  constructor(private readonly db: PrismaService) {}

  async getOrgProducts(orgID: Org['id']) {
    return this.db.product
      .findMany({ where: { orgID } })
      .then(mapProductModelToEntity);
  }

  async PMFLiveScore(productID: Product['id']) {
    const startOfSprintWindow = await this.startOfSprintWindow(productID);

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

  /**
   * Calculate start of rolling sprint window of the given product.
   */
  private async startOfSprintWindow(productID: string): Promise<string> {
    const { daysPerSprint } = await this.db.product.findUniqueOrThrow({
      where: { id: productID },
      select: { daysPerSprint: true },
    });

    const startOfSprintWindow = dayjs()
      .subtract(daysPerSprint, 'day')
      .toISOString();

    return startOfSprintWindow;
  }

  async currentMIT(productID: Product['id']) {
    const { daysPerSprint } = await this.db.product.findUniqueOrThrow({
      where: { id: productID },
      select: { daysPerSprint: true },
    });

    const startOfSprintWindow = dayjs()
      .subtract(daysPerSprint, 'day')
      .toISOString();

    return this.db.mit
      .findMany({
        where: {
          productID,
          createdAt: { gte: startOfSprintWindow },
        },
        orderBy: { createdAt: 'desc' },
      })
      .then(mapMITModelsToEntity);
  }
}
