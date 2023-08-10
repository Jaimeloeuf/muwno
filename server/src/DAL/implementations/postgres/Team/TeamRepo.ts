import { Injectable } from '@nestjs/common';

import type { ITeamRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type {
  OrgID,
  UserID,
  CreateOneTeamMemberInvitationDTO,
  User,
} from 'domain-model';

// Mappers
import {
  mapUserModelsToEntity,
  mapToTeamInvitations,
  mapToTeamInvitation,
} from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class TeamRepo implements ITeamRepo {
  constructor(private readonly db: PrismaService) {}

  async getAllMembers(orgID: OrgID) {
    return this.db.user
      .findMany({
        where: { orgID },
        // Sort by newest member first
        orderBy: { createdAt: 'desc' },
      })
      .then(mapUserModelsToEntity);
  }

  async createInvite(
    inviterUserID: UserID,
    orgID: OrgID,
    createOneTeamMemberInvitationDTO: CreateOneTeamMemberInvitationDTO,
  ) {
    // Using an upsert to ensure that duplicates wont be created
    await this.db.team_member_invitation.upsert({
      create: {
        inviteeEmail: createOneTeamMemberInvitationDTO.inviteeEmail,
        inviterID: inviterUserID,
        orgID,
      },
      where: { inviteeEmail: createOneTeamMemberInvitationDTO.inviteeEmail },
      // Only update inviterUserID to prevent a OrgID attack where someone from
      // another org can just invite the user to prevent them from joining the
      // original Org they were invited to.
      update: { inviterID: inviterUserID },
    });

    return true;
  }

  async getPendingInvites(inviteeEmail: User['email']) {
    return this.db.team_member_invitation
      .findMany({
        where: { inviteeEmail },
        include: {
          inviter: { select: { name: true, role: true } },
          org: { select: { name: true } },
        },
      })
      .then(mapToTeamInvitations);
  }

  async getInvite(invitationID: number) {
    return this.db.team_member_invitation
      .findUnique({
        where: { id: invitationID },
        include: {
          inviter: { select: { name: true, role: true } },
          org: { select: { name: true } },
        },
      })
      .then(runMapperIfNotNull(mapToTeamInvitation));
  }

  async deleteInvite(invitationID: number) {
    await this.db.team_member_invitation.delete({
      where: { id: invitationID },
    });
  }
}
