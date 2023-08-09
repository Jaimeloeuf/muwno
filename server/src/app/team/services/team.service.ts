import { Injectable } from '@nestjs/common';

import {
  ITeamRepo,
  IOrgRepo,
  IUserRepo,
} from '../../../DAL/abstraction/index.js';
import { IEmailService } from '../../../infra/abstractions/index.js';

// Entity Types
import type { User, UserID } from 'domain-model';

// DTO Types
import type { CreateOneTeamMemberInvitationDTO } from 'domain-model';

// Service layer Exceptions
import {
  InvalidOperationException,
  InvalidInternalStateException,
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
    const user = await this.userRepo.getOne(inviterUserID);
    if (user === null)
      throw new InvalidInternalStateException(
        `User '${inviterUserID}' does not exists!`,
      );

    const userOrg = await this.orgRepo.getUserOrg(inviterUserID);
    if (userOrg === null)
      throw new InvalidInternalStateException(
        `User '${inviterUserID}' does not have an Org!`,
      );

    const inviteCreated = await this.teamRepo.createInvite(
      inviterUserID,
      userOrg.id,
      createOneTeamMemberInvitationDTO,
    );

    if (!inviteCreated) throw new Error('Failed to create team member invite');

    // only email users the invite link if this succeeded!
    await this.emailService.sendOne(user.email, {
      from: 'robot@thepmftool.com',
      subject: `${user.name} invited you to join ${userOrg.name}`,
      textBody: createInviteTeamMemberEmailMessage(user.name, userOrg.name),
    });
  }
}
