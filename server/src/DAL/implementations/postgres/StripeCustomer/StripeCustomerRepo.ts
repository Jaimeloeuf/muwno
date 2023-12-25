import { Injectable } from '@nestjs/common';

import type { IStripeCustomerRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { OrgID } from 'domain-model';
import type { Customer } from '../../../../types/index.js';

// Mappers
import { mapStripeCustomerModelToEntity } from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class StripeCustomerRepo implements IStripeCustomerRepo {
  constructor(private readonly db: PrismaService) {}

  async getCustomerWithStripeCustomerID(id: Customer['id']) {
    return this.db.stripe_customer
      .findUnique({ where: { id } })
      .then(runMapperIfNotNull(mapStripeCustomerModelToEntity));
  }

  async getCustomerWithOrgID(org_id: OrgID) {
    return this.db.stripe_customer
      .findUnique({ where: { org_id } })
      .then(runMapperIfNotNull(mapStripeCustomerModelToEntity));
  }

  async getCustomerIDWithOrgID(org_id: OrgID) {
    return this.db.stripe_customer
      .findUnique({
        where: { org_id },
        select: { id: true },
      })
      .then(runMapperIfNotNull(({ id }) => id));
  }

  async createOne(org_id: OrgID, id: string) {
    await this.db.stripe_customer.upsert({
      where: { id },
      create: {
        id,
        org_id,
      },
      update: { id },
    });
  }
}
