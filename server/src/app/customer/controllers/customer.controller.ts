import { Controller, Get, Post, Param, Body } from '@nestjs/common';

import { CustomerService } from '../services/customer.service.js';

import {
  GuardWithRBAC,
  AllowAllRoles,
  JWT_uid,
} from '../../../guards/index.js';

// Entity Types
import type { OrgID, FirebaseAuthUID } from 'domain-model';

// DTO Validators
import { ValidatedCreateOneCustomerDTO } from '../dto-validation/ValidatedCreateOneCustomerDTO.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('customer')
@GuardWithRBAC()
@UseHttpControllerFilters
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   */
  @Post('upload/:orgID')
  @AllowAllRoles
  async upload(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('orgID') orgID: OrgID,
    @Body() validatedCreateOneCustomerDTO: ValidatedCreateOneCustomerDTO,
  ): Promise<void> {
    await this.customerService.newCustomer(
      requestorID,
      orgID,
      validatedCreateOneCustomerDTO,
    );
  }
}
