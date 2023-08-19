import { Injectable } from '@nestjs/common';

import type { IPlanRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Mappers
import { mapPlanModelsToEntity } from './mapper.js';

@Injectable()
export class PlanRepo implements IPlanRepo {
  constructor(private readonly db: PrismaService) {}

  async getActive() {
    return this.db.plan
      .findMany({
        where: { active: true },

        // @todo Should these be ordered? order with what column?
        // orderBy: { createdAt: 'asc' },
      })
      .then(mapPlanModelsToEntity);
  }
}
