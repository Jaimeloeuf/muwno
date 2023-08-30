import { Injectable } from '@nestjs/common';

import type { IApiKeyRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { ProductID, ApiKeyDetailID, UserID } from 'domain-model';

// Mappers
import { mapApiKeyModelToEntity, mapApiKeyModelsToEntity } from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class ApiKeyRepo implements IApiKeyRepo {
  constructor(private readonly db: PrismaService) {}

  async getProductApiKeys(productID: ProductID) {
    return this.db.api_key
      .findMany({
        where: { productID },
        orderBy: { createdAt: 'desc' },

        include: {
          createdBy: {
            select: { name: true },
          },
        },
      })
      .then(mapApiKeyModelsToEntity);
  }

  async getOne(apiKeyID: ApiKeyDetailID) {
    return this.db.api_key
      .findUnique({
        where: { id: apiKeyID },
        include: {
          createdBy: {
            select: { name: true },
          },
        },
      })
      .then(runMapperIfNotNull(mapApiKeyModelToEntity));
  }

  async saveOne(
    productID: ProductID,
    createdBy: UserID,
    hash: string,
    prefix: string,
  ) {
    return this.db.api_key
      .create({
        data: {
          hash,
          prefix,
          productID,
          userID: createdBy,
        },

        include: {
          createdBy: {
            select: { name: true },
          },
        },
      })
      .then(mapApiKeyModelToEntity);
  }

  async deleteOne(apiKeyID: ApiKeyDetailID) {
    await this.db.api_key.delete({ where: { id: apiKeyID } });
  }
}
