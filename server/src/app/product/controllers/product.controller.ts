import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';

import { ProductService } from '../services/product.service.js';

// Entity Types
import type { Product } from 'domain-model';

// DTO Types
import type {
  CreateOneProductDTO,
  ReadOneProductDTO,
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
   * Create a new Product
   */
  @Post('create')
  async createProduct(
    // @todo Add DTO Validation
    @Body() createOneProductDTO: CreateOneProductDTO,
  ): Promise<ReadOneProductDTO> {
    // @todo Hardcoded orgID that should be read from user's JWT
    const orgID = '__TEST_ORG_ID__';

    return this.productService
      .createProduct(orgID, createOneProductDTO)
      .then((product) => ({ product }));
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
   * Get PMF score of all time periods within the selected time range.
   */
  @Get('PMF/range/:productID')
  async getPMFScoresOfSelectedRange(
    @Param('productID') productID: Product['id'],

    @Query('intervals', ParseIntPipe) intervals: number,
    @Query('intervalType') intervalType: string,
  ): Promise<ReadManyPMFScoreDTO> {
    return this.productService
      .getPMFScoresOfSelectedRange(productID, intervals, intervalType)
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
