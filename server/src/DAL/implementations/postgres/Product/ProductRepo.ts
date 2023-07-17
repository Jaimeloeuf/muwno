import { Injectable } from '@nestjs/common';

import type { IProductRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { Org } from 'domain-model';

// Mappers
import { mapProductModelToEntity } from './mapper.js';

@Injectable()
export class ProductRepo implements IProductRepo {
  constructor(private readonly db: PrismaService) {}

  async getOrgProducts(orgID: Org['id']) {
    return this.db.product
      .findMany({ where: { orgID } })
      .then(mapProductModelToEntity);
  }
}
