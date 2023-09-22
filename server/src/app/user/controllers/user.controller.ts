import { Controller, Get, Post, Body } from '@nestjs/common';

import { UserService } from '../services/user.service.js';

import {
  GuardWithRBAC,
  NoRoleRequired,
  JWT_uid,
  JWT,
} from '../../../guards/index.js';
import type { ServerJWT } from '../../../types/ServerJWT.js';

// Entity Types
import type { FirebaseAuthUID } from 'domain-model';

// DTO Types
import type { ReadOneUserDTO } from 'domain-model';

// DTO Validators
import { ValidatedCreateOneUserDTO } from '../dto-validation/ValidatedCreateOneUserDTO.js';

// Exceptions and Filters
import { InvalidInternalStateException } from '../../../exceptions/index.js';
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('user')
@GuardWithRBAC()
@UseHttpControllerFilters
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get the user's own User Entity object.
   */
  @Get('self')
  @NoRoleRequired
  async getSelf(@JWT_uid userID: FirebaseAuthUID): Promise<ReadOneUserDTO> {
    return this.userService.getUser(userID).then((user) => ({ user }));
  }

  /**
   * Get the user's onboarding status.
   */
  @Get('onboarding/status')
  @NoRoleRequired
  async getOnboardingStatus(
    @JWT_uid userID: FirebaseAuthUID,
  ): Promise<{ onboarding: boolean }> {
    return this.userService
      .isUserOnboarded(userID)
      .then((onboarded) => ({ onboarding: !onboarded }));
  }

  /**
   * Create a new User
   */
  @Post('create')
  @NoRoleRequired
  async createUser(
    @JWT() jwt: ServerJWT,
    @Body() createOneUserDTO: ValidatedCreateOneUserDTO,
  ): Promise<ReadOneUserDTO> {
    if (jwt.email === undefined)
      throw new InvalidInternalStateException(
        `Email missing from JWT for creating user '${jwt.uid}'`,
      );

    return this.userService
      .createUser(jwt.uid, jwt.email, createOneUserDTO)
      .then((user) => ({ user }));
  }
}
