import { Controller, Get, Post, Param, Body } from '@nestjs/common';

import { CustomerService } from '../services/customer.service.js';

import {
  GuardWithRBAC,
  AllowAllRoles,
  JWT_uid,
} from '../../../guards/index.js';

// Entity Types
import type { OrgID, FirebaseAuthUID } from 'domain-model';

// DTO Types
import type { ReadCustomerCountDTO } from 'domain-model';

// DTO Validators
import { ValidatedCreateManyCustomerDTO } from '../dto-validation/ValidatedCreateManyCustomerDTO.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('customer')
@GuardWithRBAC()
@UseHttpControllerFilters
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Get customer groups of an Org.
   */
  @Get('group/of-org/:orgID')
  @AllowAllRoles
  async getCustomerGroups(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('orgID') orgID: OrgID,
  ): Promise<{ groups: unknown }> {
    console.log(requestorID, orgID);
    // this.customerService.getCustomerGroups
    // @todo scaffold
    return { groups: 1 };
  }

  /**
   * Get the number of Customers currently stored.
   */
  @Get('count/:orgID')
  @AllowAllRoles
  async getCustomerCount(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('orgID') orgID: OrgID,
  ): Promise<ReadCustomerCountDTO> {
    return this.customerService
      .getCount(requestorID, orgID)
      .then((count) => ({ count }));
  }

  /**
   * Upload a batch of `Customer`
   */
  @Post('upload/batch/:orgID')
  @AllowAllRoles
  async batchUpload(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('orgID') orgID: OrgID,
    @Body() validatedCreateManyCustomerDTO: ValidatedCreateManyCustomerDTO,
  ): Promise<void> {
    await this.customerService.newCustomers(
      requestorID,
      orgID,
      validatedCreateManyCustomerDTO.customers,
    );
  }
}
