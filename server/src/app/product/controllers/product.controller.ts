import { Controller, Get, Param } from '@nestjs/common';

import { ProductService } from '../services/product.service.js';

// Entity Types
import type { Product } from 'domain-model';

// DTO Types
import type { ReadManyProductDTO, ReadManyMITDTO } from 'domain-model';

// Mappers
import { mapManyProductEntityToDTO } from '../mapper/toDTOs/products.js';
import { mapManyMitEntityToDTO } from '../mapper/toDTOs/mit.js';

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

  /**
   * Get a list of MITs that the team should work on
   */
  @Get('MIT/current/:productID')
  async getCurrentMIT(
    @Param('productID') productID: Product['id'],
  ): Promise<ReadManyMITDTO> {
    return this.productService
      .getCurrentMIT(productID)
      .then(mapManyMitEntityToDTO);
  }
}
