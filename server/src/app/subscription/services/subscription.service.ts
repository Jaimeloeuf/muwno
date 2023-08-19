import { Injectable } from '@nestjs/common';

import { IPlanRepo } from '../../../DAL/index.js';

// Entity Types
import type { Plan } from 'domain-model';

@Injectable()
export class SubscriptionService {
  constructor(private readonly planRepo: IPlanRepo) {}

  async getPlans(): Promise<Array<Plan>> {
    return this.planRepo.getActive();
  }
}
