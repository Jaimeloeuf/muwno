import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { ITeamRepo, IOrgRepo, IUserRepo } from '../../../DAL/index.js';
import { UserService } from '../../user/services/user.service.js';
import {
  ITransactionalEmailService,
  IAuthService,
} from '../../../infra/index.js';

// Entity Types
import type { User, UserID, TeamInvitation } from 'domain-model';
import { Role } from 'domain-model';

// DTO Types
import type { CreateOneTeamMemberInvitationDTO } from 'domain-model';

// Service layer Exceptions
import {
  InvalidOperationException,
  InvalidInternalStateException,
  ServiceException,
  ForbiddenException,
} from '../../../exceptions/index.js';

// Utils
import { teamInviteEmailBuilder } from '../../../utils/index.js';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepo: ITeamRepo,
    private readonly orgRepo: IOrgRepo,
    private readonly userRepo: IUserRepo,
    private readonly userService: UserService,
    private readonly transactionalEmailService: ITransactionalEmailService,
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
   * Get all pending team invitations of the user's Org.
   */
  async getOrgPendingInvites(userID: UserID): Promise<Array<TeamInvitation>> {
    const userOrg = await this.orgRepo.getUserOrg(userID);
    if (userOrg === null)
      throw new InvalidOperationException(
        `User '${userID}' does not have an Org!`,
      );

    return this.teamRepo.getOrgPendingInvites(userOrg.id);
  }

  /**
   * Invite a user to join a Team.
   */
  async inviteMember(
    inviterUserID: UserID,
    createOneTeamMemberInvitationDTO: CreateOneTeamMemberInvitationDTO,
  ): Promise<void> {
    const inviter = await this.userService.getUser(inviterUserID);

    const inviterOrg = await this.orgRepo.getUserOrg(inviterUserID);
    if (inviterOrg === null)
      throw new InvalidInternalStateException(
        `User '${inviterUserID}' does not have an Org!`,
      );

    const inviteCreated = await this.teamRepo.createInvite(
      ulid(),
      inviterUserID,
      inviterOrg.id,
      createOneTeamMemberInvitationDTO,
    );

    if (!inviteCreated)
      throw new ServiceException('Failed to create team member invite');

    this.transactionalEmailService.email(
      createOneTeamMemberInvitationDTO.inviteeEmail,
      teamInviteEmailBuilder.subject(inviter.name, inviterOrg.name),
      teamInviteEmailBuilder.body(inviter.name, inviterOrg.name),
    );
  }

  /**
   * Delete a pending invitation.
   */
  async deleteInvite(requestorID: UserID, invitationID: string): Promise<void> {
    const invitation = await this.teamRepo.getInvite(invitationID);
    if (invitation === null)
      throw new InvalidInternalStateException(
        `Invitation '${invitationID}' does not exists!`,
      );

    const requestor = await this.userService.getUser(requestorID);
    if (
      requestor.role === undefined ||
      ![Role.OrgOwner, Role.OrgAdmin].includes(requestor.role)
    )
      throw new ForbiddenException(`No permission to delete invitation`);

    if (requestor.orgID !== invitation.team.id)
      throw new ForbiddenException(`Can only delete your team's invitations!`);

    await this.teamRepo.deleteInvite(invitationID);
  }

  /**
   * Get a user's pending team invitations.
   *
   * @todo Pending invites should expire after 5 days to prune DB regularly
   */
  async getPendingInvites(userID: UserID): Promise<Array<TeamInvitation>> {
    const user = await this.userService.getUser(userID);

    return this.teamRepo.getPendingInvites(user.email);
  }

  async acceptInvitation(
    inviteeID: UserID,
    invitationID: string,
  ): Promise<void> {
    const invitee = await this.userService.getUser(inviteeID);

    const invitation = await this.teamRepo.getInvite(invitationID);
    if (invitation === null)
      throw new InvalidInternalStateException(
        `Invitation '${invitationID}' does not exists!`,
      );

    if (invitee.email !== invitation.inviteeEmail)
      throw new ForbiddenException(`You can only accept your own invitations!`);

    // Update invitee's OrgID and Role in data source
    await this.userRepo.updateOne(inviteeID, {
      org_id: invitation.team.id,
      role: invitation.role,
    });

    // Set custom claims onto the invitee's JWT
    await this.authService.setCustomClaims(inviteeID, {
      roles: [invitation.role],
    });

    // @todo
    // If they click open invite link from email to join a org, backend should
    // auto set email_verified to true. Use a link with a query param, when used
    // signup makes an API call to backend to set it as email verified in same
    // table first, and skip sending verification email using auth provider.

    // Delete the invite
    await this.teamRepo.deleteInvite(invitationID);

    // @todo Notify inviter that invitee has accepted the invite
  }

  async rejectInvitation(
    inviteeID: UserID,
    invitationID: string,
  ): Promise<void> {
    const invitee = await this.userService.getUser(inviteeID);

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

  async removeMember(requestorID: UserID, userID: UserID): Promise<void> {
    await this.userService.validateRole(requestorID, [
      Role.OrgOwner,
      Role.OrgAdmin,
    ]);

    const user = await this.userService.getUser(userID);
    if (user.role === Role.OrgOwner) {
      throw new ForbiddenException(`OrgOwner cannot be removed`);
    }

    const requestor = await this.userService.getUser(requestorID);
    if (requestor.orgID !== user.orgID) {
      throw new ForbiddenException(`Can only remove member from your own Org`);
    }

    await this.teamRepo.removeMember(userID);
    await this.authService.clearCustomClaims(userID);
  }
}
