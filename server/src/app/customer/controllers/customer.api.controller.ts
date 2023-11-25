import { Controller, Get, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { CustomerApiService } from '../services/customer.api.service.js';

import { GuardWithApiKey, ApiKeyOrg } from '../../../guards/apikey/index.js';

// Entity Types
import type { Org, CustomerIdentifier } from 'domain-model';

// DTO Types
import type { ReadCustomerCountDTO } from 'domain-model';

// DTO Validators
import { ValidatedCreateOneCustomerDTO } from '../dto-validation/ValidatedCreateOneCustomerDTO.js';
import { ValidatedCreateManyCustomerDTO } from '../dto-validation/ValidatedCreateManyCustomerDTO.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('api/customer')
@GuardWithApiKey()
@Throttle({ default: { limit: 600, ttl: 3000 } })
@UseHttpControllerFilters
export class CustomerApiController {
  constructor(private readonly customerService: CustomerApiService) {}

  /**
   * Get the number of Customers currently stored.
   */
  @Get('count')
  async getCustomerCount(@ApiKeyOrg() org: Org): Promise<ReadCustomerCountDTO> {
    return this.customerService.getCount(org.id).then((count) => ({ count }));
  }

  /**
   * Upload a single `Customer`.
   */
  @Post('upload')
  async upload(
    @ApiKeyOrg() org: Org,
    @Body() validatedCreateOneCustomerDTO: ValidatedCreateOneCustomerDTO,
  ): Promise<CustomerIdentifier> {
    return this.customerService.newCustomer(
      org.id,
      validatedCreateOneCustomerDTO,
    );
  }

  /**
   * Upload a batch of `Customer`
   *
   * @todo
   * Just like `CustomerController`, tell API users about the size limit per
   * batch then tell them to loop through, or if they use our SDK, the SDK
   * should do the batch splitting for them.
   */
  @Post('upload/batch')
  async batchUpload(
    @ApiKeyOrg() org: Org,
    @Body() validatedCreateManyCustomerDTO: ValidatedCreateManyCustomerDTO,
  ): Promise<Array<CustomerIdentifier>> {
    return this.customerService.newCustomers(
      org.id,
      validatedCreateManyCustomerDTO.customers,
    );
  }
}
