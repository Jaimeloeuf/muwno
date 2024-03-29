import { Injectable } from '@nestjs/common';

import type {
  IUserRepo,
  DBCreateOneUserDTO,
} from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { UserID } from 'domain-model';

// Mappers
import { mapUserModelToEntity } from './mapper.js';

// Utils
import { RoleTypeToDbRoleEnumMapping } from '../utils/dbRoleMapper.js';
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class UserRepo implements IUserRepo {
  constructor(private readonly db: PrismaService) {}

  async getOne(id: UserID) {
    return this.db.user
      .findUnique({ where: { id } })
      .then(runMapperIfNotNull(mapUserModelToEntity));
  }

  async isOnboarded(id: UserID) {
    return this.db.user
      .findUnique({
        where: { id },
        select: {
          org: {
            select: {
              subscribed: true,
            },
          },
        },
      })
      .then(
        // Because of optional chaining and default to false, non-existent user
        // accounts will be treated as not onboarded too.
        (user) => user?.org?.subscribed ?? false,
      );
  }

  async createOne(createOneUserDTO: DBCreateOneUserDTO) {
    const dbRole =
      createOneUserDTO.role === undefined
        ? null
        : RoleTypeToDbRoleEnumMapping[createOneUserDTO.role];

    return this.db.user
      .create({
        data: { ...createOneUserDTO, role: dbRole },
      })
      .then(mapUserModelToEntity);
  }

  async updateOne(id: UserID, updateOneUserDTO: Partial<DBCreateOneUserDTO>) {
    if (updateOneUserDTO.role === undefined) {
      delete updateOneUserDTO.role;

      const updateOneUserDTO_withoutRole = updateOneUserDTO as Partial<
        Omit<DBCreateOneUserDTO, 'role'>
      >;

      return this.db.user
        .update({
          where: { id },
          data: updateOneUserDTO_withoutRole,
        })
        .then(mapUserModelToEntity);
    }

    return this.db.user
      .update({
        where: { id },
        data: {
          ...updateOneUserDTO,
          role: RoleTypeToDbRoleEnumMapping[updateOneUserDTO.role],
        },
      })
      .then(mapUserModelToEntity);
  }

  async deactivateOne(id: UserID) {
    await this.db.user.update({
      where: { id },
      data: { deactivated: true },
    });
  }
}
