import { Injectable } from '@nestjs/common';

import type {
  ICustomerRepo,
  DBCreateOneCustomerDTO,
} from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { OrgID } from 'domain-model';

@Injectable()
export class CustomerRepo implements ICustomerRepo {
  constructor(private readonly db: PrismaService) {}

  async newOne(orgID: OrgID, customer: DBCreateOneCustomerDTO) {
    await this.db.customer.create({
      data: {
        ...customer,
        org_id: orgID,
      },
    });
  }
}
