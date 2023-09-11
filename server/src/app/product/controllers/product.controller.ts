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
import type { FirebaseAuthUID, ProductID } from 'domain-model';

// DTO Types
import type {
  ReadOneProductDTO,
  ReadManyProductDTO,
  ReadOnePMFScoreDTO,
  ReadManyPMFScoreDTO,
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
   * Get a single product the user can access.
   */
  @Get(':productID')
  @AllowAllRoles
  async getProduct(
    @JWT_uid userID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
  ): Promise<ReadOneProductDTO> {
    return this.productService
      .getProduct(userID, productID)
      .then((product) => ({ product }));
  }

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
   * Get the live PMF score of a rolling time window.
   */
  @Get('PMF/live/:productID')
  @AllowAllRoles
  async getPMFLiveScore(
    @Param('productID') productID: ProductID,
  ): Promise<ReadOnePMFScoreDTO> {
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
}
