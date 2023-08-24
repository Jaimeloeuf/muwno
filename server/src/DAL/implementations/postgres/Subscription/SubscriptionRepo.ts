import { Injectable } from '@nestjs/common';

import type { ISubscriptionRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { OrgID } from 'domain-model';

@Injectable()
export class SubscriptionRepo implements ISubscriptionRepo {
  constructor(private readonly db: PrismaService) {}

  async activateSubscription(orgID: OrgID) {
    await this.db.org.update({
      where: { id: orgID },
      data: { subscribed: true },
    });
  }

  async deactivateSubscription(orgID: OrgID) {
    await this.db.org.update({
      where: { id: orgID },
      data: { subscribed: false },
    });
  }
}
