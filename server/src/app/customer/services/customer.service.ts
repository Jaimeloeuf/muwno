import { Injectable, Logger } from '@nestjs/common';
import { ulid } from 'ulid';

import { ICustomerRepo } from '../../../DAL/index.js';
import { OrgService } from '../../org/services/org.service.js';

// Entity Types
import type { UserID, OrgID } from 'domain-model';

// DTO Types
import type { CreateOneCustomerDTO } from 'domain-model';

@Injectable()
export class CustomerService {
  constructor(
    private readonly logger: Logger,
    private readonly customerRepo: ICustomerRepo,
    private readonly orgService: OrgService,
  ) {}

  /**
   * Import a batch of new `Customer`.
   */
  async newCustomers(
    requestorID: UserID,
    orgID: OrgID,
    createOneCustomerDTOs: Array<CreateOneCustomerDTO>,
  ): Promise<void> {
    await this.orgService.validateUserAccess(requestorID, orgID);

    await Promise.all(
      createOneCustomerDTOs.map((customer) => {
        // Since every property on createOneCustoemrDTO is nullable, ensure that
        // not all of them is null at the same time, and return early if so.
        if (Object.values(customer).every((v) => v === null))
          return this.logger.warn(
            'Cannot create Customer with all null properties',
            CustomerService.name,
          );

        const id = ulid();

        return this.customerRepo.newOne(orgID, {
          id,
          cid: customer.cid ?? id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        });
      }),
    );
  }
}
