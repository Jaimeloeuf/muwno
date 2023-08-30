import { randomBytes, createHash } from 'crypto';
import { Injectable } from '@nestjs/common';

import { IApiKeyRepo } from '../../../DAL/index.js';
import { ProductService } from '../../product/services/product.service.js';

// Entity Types
import type {
  UserID,
  ProductID,
  ApiKeyDetail,
  ApiKeyDetailID,
} from 'domain-model';

// DTO Types
import type { ReadOneApiKeyDTO } from 'domain-model';

// Service layer Exceptions
import { NotFoundException } from '../../../exceptions/index.js';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly apiKeyRepo: IApiKeyRepo,
    private readonly productService: ProductService,
  ) {
    this.hashApiKey = (key: string) =>
      createHash('sha256').update(key).digest('base64url');
  }

  /**
   * Hash function to hash API Key before saving it in data source.
   */
  private readonly hashApiKey: (key: string) => string;

  /**
   * Get a list of all the API Key Detail objects for a given product.
   */
  async getApiKeyDetailsOfProduct(
    requestorID: UserID,
    productID: ProductID,
  ): Promise<Array<ApiKeyDetail>> {
    await this.productService.validateUserAccess(requestorID, productID);

    return this.apiKeyRepo.getProductApiKeys(productID);
  }

  /**
   * Create and save new API Key for selected product.
   */
  async createApiKey(
    requestorID: UserID,
    productID: ProductID,
  ): Promise<ReadOneApiKeyDTO> {
    await this.productService.validateUserAccess(requestorID, productID);

    const key = 'sk:' + randomBytes(32).toString('base64');
    const hash = this.hashApiKey(key);
    const prefix = key.slice(0, 6);

    const apiKeyDetail = await this.apiKeyRepo.saveOne(
      productID,
      requestorID,
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

    await this.productService.validateUserAccess(
      requestorID,
      apiKeyDetail.productID,
    );

    await this.apiKeyRepo.deleteOne(apiKeyID);
  }
}
