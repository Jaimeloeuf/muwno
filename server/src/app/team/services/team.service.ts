import { Injectable } from '@nestjs/common';

import { ITeamRepo, IOrgRepo, IUserRepo } from '../../../DAL/index.js';
import { IEmailService, IAuthService } from '../../../infra/index.js';

// Entity Types
import type { User, UserID, TeamInvitation } from 'domain-model';
import { Role } from 'domain-model';

// DTO Types
import type { CreateOneTeamMemberInvitationDTO } from 'domain-model';

// Service layer Exceptions
import {
  InvalidOperationException,
  InvalidInternalStateException,
  ForbiddenException,
} from '../../../exceptions/index.js';

// Utils
import { createInviteTeamMemberEmailMessage } from '../utils/InviteTeamMemberEmailMessage.js';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepo: ITeamRepo,
    private readonly orgRepo: IOrgRepo,
    private readonly userRepo: IUserRepo,
    private readonly emailService: IEmailService,
    private readonly authService: IAuthService,
  ) {}

  /**
   * Get all members of the user's Org team.
   */
  async getAllMembersOfUsersOrg(userID: UserID): Promise<Array<User>> {
    const userOrg = await this.orgRepo.getUserOrg(userID);
    if (userOrg === null)
      throw new InvalidOperationException(
        `User '${userID}' does not have an Org!`,
      );

    return this.teamRepo.getAllMembers(userOrg.id);
  }

  /**
   * Invite a user to join a Team.
   */
  async inviteMember(
    inviterUserID: UserID,
    createOneTeamMemberInvitationDTO: CreateOneTeamMemberInvitationDTO,
  ): Promise<void> {
    const inviter = await this.userRepo.getOne(inviterUserID);
    if (inviter === null)
      throw new InvalidInternalStateException(
        `User '${inviterUserID}' does not exists!`,
      );

    const inviterOrg = await this.orgRepo.getUserOrg(inviterUserID);
    if (inviterOrg === null)
      throw new InvalidInternalStateException(
        `User '${inviterUserID}' does not have an Org!`,
      );

    const inviteCreated = await this.teamRepo.createInvite(
      inviterUserID,
      inviterOrg.id,
      createOneTeamMemberInvitationDTO,
    );

    if (!inviteCreated) throw new Error('Failed to create team member invite');

    // Only email invitee if invitation is successfully saved
    await this.emailService.sendOne(
      createOneTeamMemberInvitationDTO.inviteeEmail,
      {
        from: 'robot@thepmftool.com',
        subject: `${inviter.name} invited you to join ${inviterOrg.name}`,
        body: createInviteTeamMemberEmailMessage(inviter.name, inviterOrg.name),
      },
    );
  }

  /**
   * Get a user's pending team invitations.
   */
  async getPendingInvites(userID: UserID): Promise<Array<TeamInvitation>> {
    const user = await this.userRepo.getOne(userID);
    if (user === null)
      throw new InvalidInternalStateException(
        `User '${userID}' does not exists!`,
      );

    return this.teamRepo.getPendingInvites(user.email);
  }

  async acceptInvitation(
    inviteeID: UserID,
    invitationID: number,
  ): Promise<void> {
    const invitee = await this.userRepo.getOne(inviteeID);
    if (invitee === null)
      throw new InvalidInternalStateException(
        `User '${inviteeID}' does not exists!`,
      );

    const invitation = await this.teamRepo.getInvite(invitationID);
    if (invitation === null)
      throw new InvalidInternalStateException(
        `Invitation '${invitationID}' does not exists!`,
      );

    if (invitee.email !== invitation.inviteeEmail)
      throw new ForbiddenException(`You can only accept your own invitations!`);

    // Update invitee's OrgID and Role in data source
    await this.userRepo.updateOne(inviteeID, {
      orgID: invitation.team.id,
      role: Role.OrgUser,
    });

    // Set custom claims onto the invitee's JWT
    await this.authService.setCustomClaims(inviteeID, {
      // @todo Defaults to OrgUser until we let inviters select the role
      roles: [Role.OrgUser],
    });

    // Delete the invite
    await this.teamRepo.deleteInvite(invitationID);

    // @todo Notify inviter that invitee has accepted the invite
  }

  async rejectInvitation(
    inviteeID: UserID,
    invitationID: number,
  ): Promise<void> {
    const invitee = await this.userRepo.getOne(inviteeID);
    if (invitee === null)
      throw new InvalidInternalStateException(
        `User '${inviteeID}' does not exists!`,
      );

    const invitation = await this.teamRepo.getInvite(invitationID);
    if (invitation === null)
      throw new InvalidInternalStateException(
        `Invitation '${invitationID}' does not exists!`,
      );

    if (invitee.email !== invitation.inviteeEmail)
      throw new ForbiddenException(`You can only reject your own invitations!`);

    // Delete the invite
    await this.teamRepo.deleteInvite(invitationID);
  }
}
