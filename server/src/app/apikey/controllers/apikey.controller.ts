import { Controller, Get, Post, Param } from '@nestjs/common';

import { ApiKeyService } from '../services/apikey.service.js';

import { GuardWithRBAC, RolesRequired, JWT_uid } from '../../../rbac/index.js';

// Entity Types
import type { FirebaseAuthUID, ProductID } from 'domain-model';
import { Role } from 'domain-model';

// DTO Types
import type { ReadManyApiKeyDTO, ReadOneApiKeyDTO } from 'domain-model';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('api-key')
@GuardWithRBAC()
@UseHttpControllerFilters
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  /**
   * Get a list of all the API Key Detail objects for a given product.
   */
  @Get('details/:productID')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async getApiKeyDetails(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
  ): Promise<ReadManyApiKeyDTO> {
    return this.apiKeyService
      .getApiKeyDetailsOfProduct(requestorID, productID)
      .then((details) => ({ details }));
  }

  /**
   * Create a new API Key for selected product.
   */
  @Post('create/:productID')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async createApiKey(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
  ): Promise<ReadOneApiKeyDTO> {
    return this.apiKeyService.createApiKey(requestorID, productID);
  }

  /**
   * Delete an API Key.
   */
  @Post('delete/:apiKeyID')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async deleteApiKey(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('apiKeyID') apiKeyID: string,
  ): Promise<void> {
    await this.apiKeyService.deleteApiKey(requestorID, apiKeyID);
  }
}
