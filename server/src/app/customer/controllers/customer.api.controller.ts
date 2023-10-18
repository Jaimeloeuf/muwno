import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { CustomerApiService } from '../services/customer.api.service.js';

import { GuardWithApiKey, ApiKeyOrg } from '../../../guards/apikey/index.js';

// Entity Types
import type { Org, CustomerID, Customer } from 'domain-model';

// DTO Validators
import { ValidatedCreateOneCustomerDTO } from '../dto-validation/ValidatedCreateOneCustomerDTO.js';
import { ValidatedCreateManyCustomerDTO } from '../dto-validation/ValidatedCreateManyCustomerDTO.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('api/customer')
@GuardWithApiKey()
@Throttle(600, 3)
@UseHttpControllerFilters
export class CustomerApiController {
  constructor(private readonly customerService: CustomerApiService) {}

  /**
   * Upload a single `Customer`.
   */
  @Post('upload')
  async upload(
    @ApiKeyOrg() org: Org,
    @Body() validatedCreateOneCustomerDTO: ValidatedCreateOneCustomerDTO,
  ): Promise<{ id: CustomerID; cid: Customer['cid'] }> {
    return this.customerService.newCustomer(
      org.id,
      validatedCreateOneCustomerDTO,
    );
  }

  /**
   * Upload a batch of `Customer`
   */
  @Post('upload/batch')
  async batchUpload(
    @ApiKeyOrg() org: Org,
    @Body() validatedCreateManyCustomerDTO: ValidatedCreateManyCustomerDTO,
  ): Promise<Array<{ id: CustomerID; cid: Customer['cid'] }>> {
    return Promise.all(
      validatedCreateManyCustomerDTO.customers.map(
        (validatedCreateOneCustomerDTO) =>
          this.customerService.newCustomer(
            org.id,
            validatedCreateOneCustomerDTO,
          ),
      ),
    );
  }
}
