import type { user as UserModel } from '@prisma/client';
import type { User } from 'domain-model';
import { DbRoleEnumToRoleTypeMapping } from '../utils/dbRoleMapper.js';

export function mapUserModelToEntity(userModel: UserModel): User {
  const user: User = {
    id: userModel.id,
    createdAt: userModel.created_at.toISOString(),
    name: userModel.name,
    email: userModel.email,
    deactivated: userModel.deactivated,
  };

  if (userModel.role !== null)
    user.role = DbRoleEnumToRoleTypeMapping[userModel.role];
  if (userModel.org_id !== null) user.orgID = userModel.org_id;

  return user;
}
