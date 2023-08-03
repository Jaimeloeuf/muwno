import { Injectable } from '@nestjs/common';

import { IUserRepo } from '../../../DAL/abstraction/index.js';

// Entity Types
import type { User, UserID } from 'domain-model';

// DTO Types
import type { CreateOneUserDTO } from 'domain-model';

// Service layer Exceptions
import { NotFoundException } from '../../../exceptions/index.js';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: IUserRepo) {}

  /**
   * Get User Entity of given `userID` from data source.
   */
  async getUser(userID: UserID): Promise<User> {
    const user = await this.userRepo.getOne(userID);
    if (user === null)
      throw new NotFoundException(`User with userID '${userID}' is not found!`);

    return user;
  }

  /**
   * Create a new User
   */
  async createUser(
    userID: UserID,
    email: string,
    createOneUserDTO: CreateOneUserDTO,
  ): Promise<User> {
    return this.userRepo.createOne({ ...createOneUserDTO, id: userID, email });
  }
}
