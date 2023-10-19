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

  // @todo
  // Might not do this at all, since we have to guarantee that all the creations
  // are idempotent, and currently Prisma does not support upsertMany.
  // Altho potentially if we keep using PostgreSQL, we can do a `createMany`
  // with `skipDuplicates: true` to solve this issue.
  // In a sense, do we want to provide the guarantee of 'idempotent' based on
  // the Customer's `cid` or isit all fields can be used to combine and stuff?
  //
  // Reference
  // https://stackoverflow.com/questions/70821501/how-to-upsert-many-fields-in-prisma-orm
  // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
  //
  // async newMany(orgID: OrgID, customers: Array<DBCreateOneCustomerDTO>) {
  //   await this.db.customer.createMany({
  //     // @todo inefficient mapping here
  //     data: customers.map((customer) => ({ ...customer, org_id: orgID })),
  //   });
  // }
}
