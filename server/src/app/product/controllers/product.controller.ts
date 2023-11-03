import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';

import { ProductService } from '../services/product.service.js';

import {
  GuardWithRBAC,
  AllowAllRoles,
  JWT_uid,
  RolesRequired,
  StrictRBAC,
} from '../../../guards/index.js';

// Entity Types
import type { FirebaseAuthUID, ProductID, OrgID } from 'domain-model';
import { Role } from 'domain-model';

// DTO Types
import type { ReadOneProductDTO, ReadManyProductDTO } from 'domain-model';

// DTO Validators
import { ValidatedCreateOneProductDTO } from '../dto-validation/ValidatedCreateOneProductDTO.js';

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
      .then((products) => ({ products }));
  }

  /**
   * Create a new Product
   */
  @Post()
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
   * Delete a single product.
   */
  @Delete(':productID')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  @StrictRBAC
  async deleteProduct(
    @JWT_uid userID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
  ) {
    await this.productService.deleteProduct(userID, productID);

    // Return empty object so that client can parse as JSON,
    // in case there is any errors thrown and returned as JSON.
    return {};
  }

  /**
   * Transfer product to a different Org.
   */
  @Post('transfer/:productID/to/:orgID')
  @RolesRequired(Role.OrgOwner)
  async transferProduct(
    @JWT_uid userID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
    @Param('orgID') orgID: OrgID,
  ) {
    await this.productService.transferProduct(userID, productID, orgID);

    // Return empty object so that client can parse as JSON,
    // in case there is any errors thrown and returned as JSON.
    return {};
  }
}
