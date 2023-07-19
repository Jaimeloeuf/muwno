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
