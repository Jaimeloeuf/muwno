import type { User, UserID } from 'domain-model';

export type DBCreateOneUserDTO = Omit<
  User,
  'orgID' | 'createdAt' | 'deactivated'
> & { org_id: string | null };

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
   * Check if given user completed onboarding.
   *
   * To be considered onboarded
   * 1. User must have an Org
   * 2. The org must have a valid subscription
   *
   * ### Warning
   * If user account does not exist, it return false for not onboarded, and does
   * not throw an error.
   */
  abstract isOnboarded(userID: UserID): Promise<boolean>;

  /**
   * Create a new User in data source
   */
  abstract createOne(
    /**
     * `org_id` and `role` always default to null on new user creation
     */
    createOneUserDTO: Omit<DBCreateOneUserDTO, 'org_id' | 'role'>,
  ): Promise<User>;

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
