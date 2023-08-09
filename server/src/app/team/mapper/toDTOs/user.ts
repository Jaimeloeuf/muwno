import type { User, ReadManyUserDTO } from 'domain-model';

/**
 * Map a many User Entity object to Read Many User DTO
 */
export const mapUserEntityToDTO = (users: Array<User>): ReadManyUserDTO => ({
  users,
});
