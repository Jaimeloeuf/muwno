import { Controller, Get, Post, Body, UseFilters } from '@nestjs/common';

import { OrgService } from '../services/org.service.js';

// DTO Types
import type { ReadOneOrgDTO, CreateOneOrgDTO } from 'domain-model';

// Mappers
import { mapOrgEntityToDTO } from '../mapper/toDTOs/org.js';

// Exception Filters
import { OrgNotFoundExceptionFilter } from '../exception-filter/index.js';

@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  /**
   * Get the given user's org, by getting their orgID from their JWT.
   */
  @Get('self')
  @UseFilters(OrgNotFoundExceptionFilter)
  async getSelfOrg(): Promise<ReadOneOrgDTO> {
    // @todo Hardcoded orgID that should be read from user's JWT
    const orgID = '__TEST_ORG_ID__';

    return this.orgService.getOrg(orgID).then(mapOrgEntityToDTO);
  }

  /**
   * Create a new Organisation
   */
  @Post('create')
  @UseFilters(OrgNotFoundExceptionFilter)
  async createOrg(
    // @todo Add DTO Validation
    @Body() createOneOrgDTO: CreateOneOrgDTO,
  ): Promise<ReadOneOrgDTO> {
    return this.orgService.createOrg(createOneOrgDTO).then(mapOrgEntityToDTO);
  }
}
