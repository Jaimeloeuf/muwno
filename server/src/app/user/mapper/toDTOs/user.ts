import type { User, ReadOneUserDTO } from 'domain-model';

/**
 * Map a single User Entity object to Read One User DTO
 */
export const mapUserEntityToDTO = (user: User): ReadOneUserDTO => ({ user });
