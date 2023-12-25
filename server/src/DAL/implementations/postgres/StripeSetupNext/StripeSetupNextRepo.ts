import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { IStripeSetupNextRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { StripeSetupNext } from 'domain-model';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class StripeSetupNextRepo implements IStripeSetupNextRepo {
  constructor(private readonly db: PrismaService) {}

  async saveOne(id: string, next: Exclude<StripeSetupNext, null>) {
    await this.db.stripe_setup_next.create({
      data: {
        id,
        next: next as unknown as Prisma.JsonObject,
      },
    });
  }

  async getOne(id: string) {
    return this.db.stripe_setup_next
      .findUnique({ where: { id } })
      .then(
        runMapperIfNotNull(({ next }) => next as unknown as StripeSetupNext),
      );
  }

  async deleteOne(id: string) {
    await this.db.stripe_setup_next.delete({ where: { id } });
  }
}
