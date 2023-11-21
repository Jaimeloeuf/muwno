import { Controller, Get } from '@nestjs/common';

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
  async byOrg(@JWT_uid userID: FirebaseAuthUID): Promise<ReadUsageDTO> {
    return this.usageService.byOrg(userID).then((usage) => ({ usage }));
  }
}
