import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { ICustomerRepo } from '../../../DAL/index.js';
import { OrgService } from '../../org/services/org.service.js';

// Entity Types
import type { UserID, OrgID, CustomerID } from 'domain-model';

// DTO Types
import type { CreateOneCustomerDTO } from 'domain-model';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepo: ICustomerRepo,
    private readonly orgService: OrgService,
  ) {}

  /**
   * Import a new `Customer`.
   */
  async newCustomer(
    requestorID: UserID,
    orgID: OrgID,
    createOneCustomerDTO: CreateOneCustomerDTO,
  ): Promise<CustomerID> {
    await this.orgService.validateUserAccess(requestorID, orgID);

    const id = ulid();

    await this.customerRepo.newOne(orgID, {
      id,

      // `cid` defaults to `id` if not provided.
      cid: createOneCustomerDTO.cid ?? id,

      name: createOneCustomerDTO.name,
      email: createOneCustomerDTO.email,
      phone: createOneCustomerDTO.phone,
    });

    return id;
  }
}
