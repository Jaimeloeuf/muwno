import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';

import { ProductService } from '../services/product.service.js';

// Entity Types
import type { Product } from 'domain-model';

// DTO Types
import type {
  ReadManyProductDTO,
  ReadOnePMFLiveScoreDTO,
  ReadManyPMFScoreDTO,
  ReadManyMITDTO,
} from 'domain-model';

// Mappers
import { mapManyProductEntityToDTO } from '../mapper/toDTOs/products.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('product')
@UseHttpControllerFilters
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
   * Get the PMF live score.
   */
  @Get('PMF/live/:productID')
  async getPMFLiveScore(
    @Param('productID') productID: Product['id'],
  ): Promise<ReadOnePMFLiveScoreDTO> {
    return this.productService
      .getPMFLiveScore(productID)
      .then((score) => ({ score }));
  }

  /**
   * Get PMF score of the selected range of sprints.
   */
  @Get('PMF/historical/:productID')
  async getPMFScoreOfSelectedSprints(
    @Param('productID') productID: Product['id'],

    @Query('startSprint', ParseIntPipe) startSprint: number,
    @Query('endSprint', ParseIntPipe) endSprint: number,
  ): Promise<ReadManyPMFScoreDTO> {
    return this.productService
      .getPMFScoreOfSelectedSprints(productID, startSprint, endSprint)
      .then((score) => ({ score }));
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
      .then((mits) => ({ mits }));
  }
}
