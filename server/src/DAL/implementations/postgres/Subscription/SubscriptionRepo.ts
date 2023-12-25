import { Injectable } from '@nestjs/common';

import type { ISubscriptionRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { OrgID } from 'domain-model';

@Injectable()
export class SubscriptionRepo implements ISubscriptionRepo {
  constructor(private readonly db: PrismaService) {}

  async isSubscribed(id: OrgID) {
    return this.db.org
      .findUnique({
        where: { id },
        select: { subscribed: true },
      })
      .then((org) => org?.subscribed ?? false);
  }

  async activateSubscription(id: OrgID) {
    await this.db.org.update({
      where: { id },
      data: { subscribed: true },
    });
  }

  async deactivateSubscription(id: OrgID) {
    await this.db.org.update({
      where: { id },
      data: { subscribed: false },
    });
  }
}
