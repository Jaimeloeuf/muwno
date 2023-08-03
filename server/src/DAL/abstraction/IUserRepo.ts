import type { User, UserID } from 'domain-model';

export type DBCreateOneUserDTO = Omit<User, 'createdAt' | 'deactivated'>;

/**
 * Data Repository interface used as an abstraction over a collection of
 * `User` Entity objects regardless of the underlying datasource.
 */
export abstract class IUserRepo {
  /**
   * Get a single User Entity object back
   */
  abstract getOne(userID: UserID): Promise<User | null>;

  /**
   * Create a new User in data source
   */
  abstract createOne(createOneUserDTO: DBCreateOneUserDTO): Promise<User>;

  /**
   * Update a User in data source
   */
  abstract updateOne(
    userID: UserID,
    updateOneUserDTO: Partial<DBCreateOneUserDTO>,
  ): Promise<User>;

  /**
   * Deactivate a User account
   */
  abstract deactivateOne(userID: UserID): Promise<void>;
}
