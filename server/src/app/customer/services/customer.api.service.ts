import { Injectable, Logger } from '@nestjs/common';
import { ulid } from 'ulid';

import { ICustomerRepo } from '../../../DAL/index.js';

// Entity Types
import type { OrgID, CustomerIdentifier } from 'domain-model';

// DTO Types
import type { CreateOneCustomerDTO } from 'domain-model';

// Service layer Exceptions
import { InvalidInputException } from '../../../exceptions/index.js';

@Injectable()
export class CustomerApiService {
  constructor(
    private readonly logger: Logger,
    private readonly customerRepo: ICustomerRepo,
  ) {}

  /**
   * Import a new `Customer`.
   */
  async newCustomer(
    orgID: OrgID,
    createOneCustomerDTO: CreateOneCustomerDTO,
  ): Promise<CustomerIdentifier> {
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

  /**
   * Import a batch of new `Customer`.
   */
  async newCustomers(
    orgID: OrgID,
    createOneCustomerDTOs: Array<CreateOneCustomerDTO>,
  ): Promise<Array<CustomerIdentifier>> {
    return Promise.all(
      createOneCustomerDTOs.map(async (customer) => {
        // Since every property on createOneCustoemrDTO is nullable, ensure that
        // not all of them is null at the same time, and return early if so.
        if (Object.values(customer).every((v) => v === null))
          return this.logger.warn(
            'Cannot create Customer with all null properties',
            CustomerApiService.name,
          );

        const id = ulid();
        const cid = customer.cid ?? id;

        await this.customerRepo.newOne(orgID, {
          id,
          cid,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        });

        return { id, cid } satisfies CustomerIdentifier;
      }),
    ).then((customerIdentifiers) =>
      customerIdentifiers.filter(
        (v): v is CustomerIdentifier => v !== undefined,
      ),
    );
  }
}
