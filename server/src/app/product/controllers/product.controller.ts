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

import { GuardWithRBAC, AllowAllRoles, JWT_uid } from '../../../rbac/index.js';

// Entity Types
import type { FirebaseAuthUID, ProductID, MIT } from 'domain-model';

// DTO Types
import type {
  ReadOneProductDTO,
  ReadManyProductDTO,
  ReadOnePMFLiveScoreDTO,
  ReadManyPMFScoreDTO,
  ReadManyMITDTO,
} from 'domain-model';

// DTO Validators
import { ValidatedCreateOneProductDTO } from '../dto-validation/ValidatedCreateOneProductDTO.js';

// Mappers
import { mapManyProductEntityToDTO } from '../mapper/toDTOs/products.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('product')
@GuardWithRBAC()
@UseHttpControllerFilters
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Get all products of the user's org
   */
  @Get('all/self')
  @AllowAllRoles
  async getUserOrgProducts(
    @JWT_uid userID: FirebaseAuthUID,
  ): Promise<ReadManyProductDTO> {
    return this.productService
      .getUserOrgProducts(userID)
      .then(mapManyProductEntityToDTO);
  }

  /**
   * Create a new Product
   */
  @Post('create')
  @AllowAllRoles
  async createProduct(
    @JWT_uid userID: FirebaseAuthUID,
    @Body() createOneProductDTO: ValidatedCreateOneProductDTO,
  ): Promise<ReadOneProductDTO> {
    return this.productService
      .createProduct(userID, createOneProductDTO)
      .then((product) => ({ product }));
  }

  /**
   * Get the PMF live score.
   */
  @Get('PMF/live/:productID')
  @AllowAllRoles
  async getPMFLiveScore(
    @Param('productID') productID: ProductID,
  ): Promise<ReadOnePMFLiveScoreDTO> {
    return this.productService
      .getPMFLiveScore(productID)
      .then((score) => ({ score }));
  }

  /**
   * Get PMF score of all time periods within the selected time range.
   */
  @Get('PMF/range/:productID')
  @AllowAllRoles
  async getPMFScoresOfSelectedRange(
    @Param('productID') productID: ProductID,

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
  @AllowAllRoles
  async getCurrentMIT(
    @Param('productID') productID: ProductID,
  ): Promise<ReadManyMITDTO> {
    return this.productService
      .getCurrentMIT(productID)
      .then((mits) => ({ mits }));
  }

  /**
   * Mark a single 'MIT' task as done.
   */
  @Post('MIT/done/:mitID')
  @AllowAllRoles
  async markTaskAsDone(
    @Param('mitID') mitID: MIT['id'],
  ): Promise<ReadManyMITDTO> {
    return this.productService.markTaskAsDone(mitID).then((mits) => ({ mits }));
  }
}
