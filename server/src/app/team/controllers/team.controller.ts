import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { TeamService } from '../services/team.service.js';

import {
  GuardWithRBAC,
  AllowAllRoles,
  JWT_uid,
  RolesRequired,
  NoRoleRequired,
  StrictRBAC,
} from '../../../guards/index.js';

// Entity Types
import type { FirebaseAuthUID, UserID } from 'domain-model';
import { Role } from 'domain-model';

// DTO Types
import type {
  ReadManyUserDTO,
  ReadManyTeamMemberInvitationDTO,
} from 'domain-model';

// DTO Validators
import { ValidatedCreateOneTeamMemberInvitationDTO } from '../dto-validation/ValidatedCreateOneTeamMemberInvitationDTO.js';

// Exception Filters
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
      .then((users) => ({ users }));
  }

  /**
   * Get all pending team invitations of the user's Org.
   */
  @Get('invites/pending/org')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async getOrgPendingInvites(
    @JWT_uid userID: FirebaseAuthUID,
  ): Promise<ReadManyTeamMemberInvitationDTO> {
    return this.teamService
      .getOrgPendingInvites(userID)
      .then((invitations) => ({ invitations }));
  }

  /**
   * Invite another user to join requestor's Org team.
   */
  @Post('member/invite')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  @StrictRBAC
  async inviteMember(
    @JWT_uid userID: FirebaseAuthUID,
    @Body()
    createOneTeamMemberInvitationDTO: ValidatedCreateOneTeamMemberInvitationDTO,
  ): Promise<void> {
    await this.teamService.inviteMember(
      userID,
      createOneTeamMemberInvitationDTO,
    );
  }

  /**
   * Delete a pending invitation.
   */
  @Delete('member/invite/:invitationID')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async deleteInvite(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('invitationID') invitationID: string,
  ): Promise<void> {
    await this.teamService.deleteInvite(requestorID, invitationID);
  }

  /**
   * Get all pending team invitations of the current user.
   */
  @Get('member/invites')
  // A user might not have any roles if they do not belong to any organisation
  // yet before they accept the invite, therefore no role is required.
  @NoRoleRequired
  async getPendingInvites(
    @JWT_uid userID: FirebaseAuthUID,
  ): Promise<ReadManyTeamMemberInvitationDTO> {
    return this.teamService
      .getPendingInvites(userID)
      .then((invitations) => ({ invitations }));
  }

  /**
   * Accept an invitation belonging to the current user.
   */
  @Post('member/invite/accept/:invitationID')
  // A user might not have any roles if they do not belong to any organisation
  // yet before they accept the invite, therefore no role is required.
  @NoRoleRequired
  async acceptInvitation(
    @JWT_uid userID: FirebaseAuthUID,
    @Param('invitationID') invitationID: string,
  ): Promise<void> {
    await this.teamService.acceptInvitation(userID, invitationID);
  }

  /**
   * Reject an invitation belonging to the current user.
   */
  @Post('member/invite/reject/:invitationID')
  // A user might not have any roles if they do not belong to any organisation
  // yet before they accept the invite, therefore no role is required.
  @NoRoleRequired
  async rejectInvitation(
    @JWT_uid userID: FirebaseAuthUID,
    @Param('invitationID') invitationID: string,
  ): Promise<void> {
    await this.teamService.rejectInvitation(userID, invitationID);
  }

  /**
   * Remove member from team and all their data from the team.
   */
  @Post('member/remove/:userID')
  @RolesRequired(Role.OrgOwner, Role.OrgAdmin)
  async removeMember(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('userID') userID: UserID,
  ): Promise<void> {
    await this.teamService.removeMember(requestorID, userID);
  }
}
