import { Injectable } from '@nestjs/common';

import type { IOrgRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { Org } from 'domain-model';

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
}
