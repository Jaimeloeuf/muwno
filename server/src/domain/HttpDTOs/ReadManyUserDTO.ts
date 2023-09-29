import type { User } from '../User/index.js';

/**
 * Read Many Users from API service.
 */
export type ReadManyUserDTO = {
  users: Array<User>;
};
