import { Injectable } from '@nestjs/common';

import { IUserRepo } from '../../../DAL/index.js';
import {
  ITransactionalEmailService,
  IAdminNotifService,
} from '../../../infra/index.js';

// Entity Types
import type { User, UserID } from 'domain-model';

// DTO Types
import type { CreateOneUserDTO } from 'domain-model';

// Service layer Exceptions
import { NotFoundException } from '../../../exceptions/index.js';

// Utils
import {
  userSignupNotifBuilder,
  userWelcomeEmailBuilder,
} from '../../../utils/index.js';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly transactionalEmailService: ITransactionalEmailService,
    private readonly adminNotifService: IAdminNotifService,
  ) {}

  /**
   * Get User Entity of given `userID` from data source.
   */
  async getUser(userID: UserID): Promise<User> {
    const user = await this.userRepo.getOne(userID);
    if (user === null)
      throw new NotFoundException(`User '${userID}' does not exist!`);

    return user;
  }

  /**
   * Get the user's onboarding status from data source.
   */
  async isUserOnboarded(userID: UserID): Promise<boolean> {
    return this.userRepo.isOnboarded(userID);
  }

  /**
   * Create a new User
   */
  async createUser(
    userID: UserID,
    email: string,
    createOneUserDTO: CreateOneUserDTO,
  ): Promise<User> {
    const user = await this.userRepo.createOne({
      ...createOneUserDTO,
      id: userID,
      email,
    });

    this.adminNotifService.send(
      userSignupNotifBuilder(
        createOneUserDTO.name,
        email,
        createOneUserDTO.phone,
      ),
    );

    this.transactionalEmailService.email(
      email,
      userWelcomeEmailBuilder.subject(createOneUserDTO.name),
      userWelcomeEmailBuilder.body(createOneUserDTO.name),
    );

    return user;
  }
}
