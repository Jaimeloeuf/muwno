import { Role as RoleEnum } from '@prisma/client';
import { Role } from 'domain-model';

/**
 * Utility object used to map a Prisma RoleEnum to Role domain type
 */
export const DbRoleEnumToRoleTypeMapping: Record<RoleEnum, Role> = {
  [RoleEnum.OrgUser]: Role.OrgUser,
  [RoleEnum.OrgAdmin]: Role.OrgAdmin,
  [RoleEnum.OrgOwner]: Role.OrgOwner,
};

/**
 * Utility object used to map a domain model's Role enum value to Prisma RoleEnum
 */
export const RoleTypeToDbRoleEnumMapping: Record<Role, RoleEnum> = {
  [Role.OrgUser]: RoleEnum.OrgUser,
  [Role.OrgAdmin]: RoleEnum.OrgAdmin,
  [Role.OrgOwner]: RoleEnum.OrgOwner,
};
