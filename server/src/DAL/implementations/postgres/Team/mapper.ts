import type { user as UserModel } from '@prisma/client';
import type { User } from 'domain-model';
import { mapUserModelToEntity } from '../User/mapper.js';

export const mapUserModelsToEntity = (
  userModels: Array<UserModel>,
): Array<User> => userModels.map(mapUserModelToEntity);
