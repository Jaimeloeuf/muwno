import { Controller, Get } from '@nestjs/common';

import { SubscriptionService } from '../services/subscription.service.js';

import { GuardWithRBAC, NoRoleRequired } from '../../../rbac/index.js';

// DTO Types
import type { ReadManyActivePlanDTO } from 'domain-model';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('subscription')
@GuardWithRBAC()
@UseHttpControllerFilters
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Get all the currently available subscription plans.
   */
  @Get('plans')
  @NoRoleRequired // No role required since users can see all before choosing.
  async getPlans(): Promise<ReadManyActivePlanDTO> {
    return this.subscriptionService.getPlans().then((plans) => ({ plans }));
  }
}
