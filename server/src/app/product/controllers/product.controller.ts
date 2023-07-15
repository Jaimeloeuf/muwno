import { Controller, Get } from '@nestjs/common';

import { ProductService } from '../services/product.service.js';

// DTO Types
import type { ReadManyProductDTO } from 'domain-model';

// Mappers
import { mapManyProductEntityToDTO } from '../mapper/toDTOs/products.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Get all products of the user's org, by getting their orgID from their JWT.
   */
  @Get('all')
  async getSelfOrgProducts(): Promise<ReadManyProductDTO> {
    // @todo Hardcoded orgID that should be read from user's JWT
    const orgID = '__TEST_ORG_ID__';

    return this.productService
      .getOrgProducts(orgID)
      .then(mapManyProductEntityToDTO);
  }
}
