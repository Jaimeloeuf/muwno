import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { IStripeSetupNextRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { StripeSetupNext } from 'domain-model';

@Injectable()
export class StripeSetupNextRepo implements IStripeSetupNextRepo {
  constructor(private readonly db: PrismaService) {}

  async saveOne(setupIntentID: string, next: Exclude<StripeSetupNext, null>) {
    await this.db.stripe_setup_next.create({
      data: {
        id: setupIntentID,
        next: next as unknown as Prisma.JsonObject,
      },
    });
  }
}
