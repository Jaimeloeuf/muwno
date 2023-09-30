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

  async getOrgApiKeyDetails(org_id: OrgID) {
    return this.db.api_key
      .findMany({
        where: { org_id },
        orderBy: { created_at: 'desc' },
      })
      .then(mapApiKeyModelsToEntity);
  }

  async getOne(apiKeyID: ApiKeyDetailID) {
    return this.db.api_key
      .findUnique({ where: { id: apiKeyID } })
      .then(runMapperIfNotNull(mapApiKeyModelToEntity));
  }

  async saveOne(
    id: string,
    org_id: OrgID,
    created_by: string,
    hash: string,
    prefix: string,
  ) {
    return this.db.api_key
      .create({
        data: {
          id,
          org_id,
          hash,
          prefix,
          created_by,
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
