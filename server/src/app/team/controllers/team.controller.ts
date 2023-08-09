import { Controller, Get, Post, Body } from '@nestjs/common';

import { TeamService } from '../services/team.service.js';

import {
  GuardWithRBAC,
  AllowAllRoles,
  JWT_uid,
  JWT,
  RolesRequired,
} from '../../../rbac/index.js';
import type { ServerJWT } from '../../../types/ServerJWT.js';

// Entity Types
import type { FirebaseAuthUID } from 'domain-model';
import { Role } from 'domain-model';

// DTO Types
import type { ReadManyUserDTO } from 'domain-model';

// DTO Validators
import { ValidatedCreateOneTeamMemberInvitationDTO } from '../dto-validation/ValidatedCreateOneTeamMemberInvitationDTO.js';

// Mappers
import { mapUserEntityToDTO } from '../mapper/toDTOs/user.js';

// Exceptions and Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('team')
@GuardWithRBAC()
@UseHttpControllerFilters
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  /**
   * Get all members of the user's Org team.
   */
  @Get('member/all')
  @AllowAllRoles
  async getAllMembersOfUsersOrg(
    @JWT_uid userID: FirebaseAuthUID,
  ): Promise<ReadManyUserDTO> {
    return this.teamService
      .getAllMembersOfUsersOrg(userID)
      .then(mapUserEntityToDTO);
  }

  /**
   * Invite another user to join requestor's Org team.
   */
  @Post('member/invite')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async inviteMember(
    @JWT() jwt: ServerJWT,
    @Body()
    createOneTeamMemberInvitationDTO: ValidatedCreateOneTeamMemberInvitationDTO,
  ): Promise<void> {
    await this.teamService.inviteMember(
      jwt.uid,
      createOneTeamMemberInvitationDTO,
    );
  }
}
