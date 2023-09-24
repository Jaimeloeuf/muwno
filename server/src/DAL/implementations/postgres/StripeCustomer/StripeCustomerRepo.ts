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

  async getCustomerWithStripeCustomerID(stripeCustomerID: Customer['id']) {
    return this.db.stripe_customer
      .findUnique({ where: { id: stripeCustomerID } })
      .then(runMapperIfNotNull(mapStripeCustomerModelToEntity));
  }

  async getCustomerWithOrgID(orgID: OrgID) {
    return this.db.stripe_customer
      .findUnique({ where: { orgID } })
      .then(runMapperIfNotNull(mapStripeCustomerModelToEntity));
  }

  async getCustomerIDWithOrgID(orgID: OrgID) {
    return this.db.stripe_customer
      .findUnique({
        where: { orgID },
        select: { id: true },
      })
      .then(runMapperIfNotNull(({ id }) => id));
  }

  async createOne(orgID: OrgID, stripeCustomerID: string) {
    await this.db.stripe_customer.create({
      data: {
        id: stripeCustomerID,
        orgID,
      },
    });
  }
}
