import { Injectable } from '@nestjs/common';

import { IUserRepo } from '../../../DAL/index.js';
import {
  ITransactionalEmailService,
  IAdminNotifService,
} from '../../../infra/index.js';

// Entity Types
import type { User, UserID } from 'domain-model';
import { Role } from 'domain-model';

// DTO Types
import type { CreateOneUserDTO } from 'domain-model';

// Service layer Exceptions
import {
  NotFoundException,
  ForbiddenException,
} from '../../../exceptions/index.js';

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
   * Get User Entity of given `userID` from data source.
   */
  async validateRole(
    userID: UserID,
    roles: Array<Role>,
    errorMessage?: string,
  ): Promise<void> {
    const user = await this.getUser(userID);
    if (user.role === undefined || !roles.includes(user.role))
      throw new ForbiddenException(
        errorMessage ??
          `User ${userID} does not have a valid role for this action.`,
      );
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
