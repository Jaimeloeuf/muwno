import { Injectable } from '@nestjs/common';

import { IProductRepo } from '../../../DAL/abstraction/index.js';

// Entity Types
import type { Org, Products } from 'domain-model';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: IProductRepo) {}

  /**
   * Get all products of an Org.
   */
  async getOrgProducts(orgID: Org['id']): Promise<Products> {
    // @todo Validate orgID

    return this.productRepo.getOrgProducts(orgID);
  }
}
