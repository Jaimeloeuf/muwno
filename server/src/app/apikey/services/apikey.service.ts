import { randomBytes } from 'crypto';
import { ulid } from 'ulid';
import { Injectable } from '@nestjs/common';

import { IApiKeyRepo } from '../../../DAL/index.js';
import { OrgService } from '../../org/services/org.service.js';
import { UserService } from '../../user/services/user.service.js';

// Entity Types
import type { UserID, ApiKeyDetail, ApiKeyDetailID } from 'domain-model';

// DTO Types
import type { ReadOneApiKeyDTO } from 'domain-model';

// Service layer Exceptions
import { NotFoundException } from '../../../exceptions/index.js';

// Utils
import { sha256hash } from '../../../utils/index.js';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly apiKeyRepo: IApiKeyRepo,
    private readonly orgService: OrgService,
    private readonly userService: UserService,
  ) {}

  /**
   * Get all API Key Detail objects of the user's Org.
   */
  async getApiKeyDetails(requestorID: UserID): Promise<Array<ApiKeyDetail>> {
    const org = await this.orgService.getUserOrg(requestorID);

    return this.apiKeyRepo.getOrgApiKeyDetails(org.id);
  }

  /**
   * Create a new API Key for user's Org.
   */
  async createApiKey(requestorID: UserID): Promise<ReadOneApiKeyDTO> {
    const org = await this.orgService.getUserOrg(requestorID);
    const user = await this.userService.getUser(requestorID);

    const key = 'sk:' + randomBytes(32).toString('base64url');
    const hash = sha256hash(key);
    const prefix = key.slice(0, 6);

    const apiKeyDetail = await this.apiKeyRepo.saveOne(
      ulid(),
      org.id,
      `${user.name} <${user.email}>`,
      hash,
      prefix,
    );

    return { ...apiKeyDetail, key };
  }

  /**
   * Delete an API Key.
   */
  async deleteApiKey(
    requestorID: UserID,
    apiKeyID: ApiKeyDetailID,
  ): Promise<void> {
    const apiKeyDetail = await this.apiKeyRepo.getOne(apiKeyID);

    if (apiKeyDetail === null)
      throw new NotFoundException(`API Key ${apiKeyID} does not exist.`);

    await this.orgService.validateUserAccess(requestorID, apiKeyDetail.orgID);

    await this.apiKeyRepo.deleteOne(apiKeyID);
  }
}
