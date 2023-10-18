import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { ICustomerRepo } from '../../../DAL/index.js';

// Entity Types
import type { OrgID, CustomerID } from 'domain-model';

// DTO Types
import type { CreateOneCustomerDTO, Customer } from 'domain-model';

// Service layer Exceptions
import { InvalidInputException } from '../../../exceptions/index.js';

@Injectable()
export class CustomerApiService {
  constructor(private readonly customerRepo: ICustomerRepo) {}

  /**
   * Import a new `Customer`.
   */
  async newCustomer(
    orgID: OrgID,
    createOneCustomerDTO: CreateOneCustomerDTO,
  ): Promise<{ id: CustomerID; cid: Customer['cid'] }> {
    // Since every property on createOneCustoemrDTO is nullable, ensure that it
    // not all of them is null at the same time.
    if (Object.values(createOneCustomerDTO).every((v) => v === null))
      throw new InvalidInputException(
        'Cannot create Customer with all null properties',
      );

    const id = ulid();
    const cid = createOneCustomerDTO.cid ?? id;

    await this.customerRepo.newOne(orgID, {
      id,
      cid,
      name: createOneCustomerDTO.name,
      email: createOneCustomerDTO.email,
      phone: createOneCustomerDTO.phone,
    });

    return { id, cid };
  }
}
