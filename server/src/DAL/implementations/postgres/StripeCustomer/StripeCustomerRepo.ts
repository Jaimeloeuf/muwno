import { Injectable } from '@nestjs/common';

import type { IStripeCustomerRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { OrgID } from 'domain-model';
import type { StripeCustomer } from '../../../../types/index.js';

// Mappers
import { mapStripeCustomerModelToEntity } from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class StripeCustomerRepo implements IStripeCustomerRepo {
  constructor(private readonly db: PrismaService) {}

  async getCustomerWithStripeCustomerID(
    stripeCustomerID: StripeCustomer['id'],
  ) {
    return this.db.stripe_customer
      .findUnique({ where: { id: stripeCustomerID } })
      .then(runMapperIfNotNull(mapStripeCustomerModelToEntity));
  }

  async createOne(
    orgID: OrgID,
    stripeCustomerID: string,
    stripeSubscriptionID: string,
  ) {
    await this.db.stripe_customer.create({
      data: {
        id: stripeCustomerID,
        subscriptionID: stripeSubscriptionID,
        orgID,
      },
    });
  }
}
