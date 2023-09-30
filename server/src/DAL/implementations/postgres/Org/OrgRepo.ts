import { Injectable } from '@nestjs/common';

import type { IOrgRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { OrgID, CreateOneOrgDTO, UserID } from 'domain-model';

// Mappers
import { mapOrgModelToEntity } from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class OrgRepo implements IOrgRepo {
  constructor(private readonly db: PrismaService) {}

  async getOne(id: OrgID) {
    return this.db.org
      .findUnique({ where: { id } })
      .then(runMapperIfNotNull(mapOrgModelToEntity));
  }

  async getUserOrg(userID: UserID) {
    return (
      this.db.user
        .findUnique({
          where: { id: userID },

          // Only load the user's Org details
          select: { org: true },
        })
        // user.org can be null/undefined so using optional chaining on it
        .then((user) => runMapperIfNotNull(mapOrgModelToEntity)(user?.org))
    );
  }

  async createOne(id: string, createOneOrgDTO: CreateOneOrgDTO) {
    return this.db.org
      .create({
        data: {
          ...createOneOrgDTO,

          id,

          // By default an Org is created before it can pay for a subscription
          // plan, therefore this is only set to true once paid.
          subscribed: false,

          // By default an Org can be created without the need for any
          // verification first since the team should verify them asynchronously.
          verified: false,
        },
      })
      .then(mapOrgModelToEntity);
  }
}
