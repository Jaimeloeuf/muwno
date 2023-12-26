import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';

import { UsageService } from '../services/usage.service.js';

import {
  GuardWithRBAC,
  AllowAllRoles,
  JWT_uid,
} from '../../../guards/index.js';

// Entity Types
import type { FirebaseAuthUID } from 'domain-model';

// DTO Types
import type { ReadUsageDTO } from 'domain-model';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('usage')
@GuardWithRBAC()
@UseHttpControllerFilters
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  /**
   * Get all usage stats of the user's org.
   */
  @Get('org')
  @AllowAllRoles
  async getStatsByOrgOfSelectedTimeRange(
    @JWT_uid userID: FirebaseAuthUID,
    @Query('timeRange', ParseIntPipe) timeRange: number,
  ): Promise<ReadUsageDTO> {
    return this.usageService
      .getStatsByOrgOfSelectedTimeRange(userID, timeRange)
      .then((usage) => ({ usage }));
  }

  /**
   * Get all usage stats of the user's org.
   */
  @Get('org/current-billing-period')
  @AllowAllRoles
  async getStatsByOrgOfCurrentBillingPeriod(
    @JWT_uid userID: FirebaseAuthUID,
  ): Promise<ReadUsageDTO> {
    return this.usageService
      .getStatsByOrgOfCurrentBillingPeriod(userID)
      .then((usage) => ({ usage }));
  }
}
