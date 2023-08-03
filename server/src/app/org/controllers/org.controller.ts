import { Controller, Get, Post, Body } from '@nestjs/common';

import { OrgService } from '../services/org.service.js';

import { GuardWithRBAC, AllowAllRoles } from '../../../rbac/index.js';

// DTO Types
import type { ReadOneOrgDTO, CreateOneOrgDTO } from 'domain-model';

// Mappers
import { mapOrgEntityToDTO } from '../mapper/toDTOs/org.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('org')
@GuardWithRBAC()
@UseHttpControllerFilters
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  /**
   * Get the given user's org, by getting their orgID from their JWT.
   */
  @Get('self')
  @AllowAllRoles
  async getSelfOrg(): Promise<ReadOneOrgDTO> {
    // @todo Hardcoded orgID that should be read from user's JWT
    const orgID = '__TEST_ORG_ID__';

    return this.orgService.getOrg(orgID).then(mapOrgEntityToDTO);
  }

  /**
   * Create a new Organisation
   */
  @Post('create')
  @AllowAllRoles
  async createOrg(
    // @todo Add DTO Validation
    @Body() createOneOrgDTO: CreateOneOrgDTO,
  ): Promise<ReadOneOrgDTO> {
    return this.orgService.createOrg(createOneOrgDTO).then(mapOrgEntityToDTO);
  }
}
