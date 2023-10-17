import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { ICustomerRepo } from '../../../DAL/index.js';
import { OrgService } from '../../org/services/org.service.js';

// Entity Types
import type { UserID, OrgID, CustomerID } from 'domain-model';

// DTO Types
import type { CreateOneCustomerDTO } from 'domain-model';

// Service layer Exceptions
import { InvalidInputException } from '../../../exceptions/index.js';

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
    // Since every property on createOneCustoemrDTO is nullable, ensure that it
    // not all of them is null at the same time.
    if (Object.values(createOneCustomerDTO).every((v) => v === null))
      throw new InvalidInputException(
        'Cannot create Customer with all null properties',
      );

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
