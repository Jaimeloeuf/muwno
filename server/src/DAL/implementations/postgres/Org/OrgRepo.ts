import { Injectable } from '@nestjs/common';

import type { IOrgRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { Org, CreateOneOrgDTO } from 'domain-model';

// Mappers
import { mapOrgModelToEntity } from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class OrgRepo implements IOrgRepo {
  constructor(private readonly db: PrismaService) {}

  async getOne(id: Org['id']) {
    return this.db.org
      .findUnique({
        where: { id },
        include: {
          plan: {
            select: { name: true },
          },
        },
      })
      .then(runMapperIfNotNull(mapOrgModelToEntity));
  }

  async createOne(createOneOrgDTO: CreateOneOrgDTO) {
    return this.db.org
      .create({
        data: {
          ...createOneOrgDTO,

          // @todo Fix the hardcoded plan on Org creation
          planID: 1,
        },

        // Create and read data back immediately to return user
        include: {
          plan: {
            select: { name: true },
          },
        },
      })
      .then(mapOrgModelToEntity);
  }
}
