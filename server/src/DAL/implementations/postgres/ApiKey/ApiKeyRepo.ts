import { Injectable } from '@nestjs/common';

import type { IApiKeyRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { OrgID, ApiKeyDetailID } from 'domain-model';

// Mappers
import { mapApiKeyModelToEntity, mapApiKeyModelsToEntity } from './mapper.js';
import { mapOrgModelToEntity } from '../Org/mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class ApiKeyRepo implements IApiKeyRepo {
  constructor(private readonly db: PrismaService) {}

  async getOrgApiKeyDetails(orgID: OrgID) {
    return this.db.api_key
      .findMany({
        where: { orgID },
        orderBy: { createdAt: 'desc' },
      })
      .then(mapApiKeyModelsToEntity);
  }

  async getOne(apiKeyID: ApiKeyDetailID) {
    return this.db.api_key
      .findUnique({ where: { id: apiKeyID } })
      .then(runMapperIfNotNull(mapApiKeyModelToEntity));
  }

  async saveOne(orgID: OrgID, createdBy: string, hash: string, prefix: string) {
    return this.db.api_key
      .create({
        data: {
          orgID,
          hash,
          prefix,
          createdBy,
        },
      })
      .then(mapApiKeyModelToEntity);
  }

  async deleteOne(apiKeyID: ApiKeyDetailID) {
    await this.db.api_key.delete({ where: { id: apiKeyID } });
  }

  async getApiKeyOrg(hash: string) {
    return this.db.api_key
      .findUnique({
        where: { hash },
        select: { org: true },
      })
      .then((apiKey) => apiKey?.org)
      .then(runMapperIfNotNull(mapOrgModelToEntity));
  }
}
