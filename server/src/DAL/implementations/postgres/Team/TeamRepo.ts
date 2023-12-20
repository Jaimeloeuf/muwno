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
import { RoleTypeToDbRoleEnumMapping } from '../utils/dbRoleMapper.js';

@Injectable()
export class TeamRepo implements ITeamRepo {
  constructor(private readonly db: PrismaService) {}

  async getAllMembers(org_id: OrgID) {
    return this.db.user
      .findMany({
        where: { org_id },
        // Sort by newest member first
        orderBy: { created_at: 'desc' },
      })
      .then(mapUserModelsToEntity);
  }

  async getOrgPendingInvites(org_id: OrgID) {
    return this.db.team_member_invitation
      .findMany({
        where: { org_id },
        include: {
          inviter: { select: { name: true, role: true } },
          org: { select: { name: true } },
        },
      })
      .then(mapToTeamInvitations);
  }

  async createInvite(
    invitationID: string,
    inviterUserID: UserID,
    org_id: OrgID,
    createOneTeamMemberInvitationDTO: CreateOneTeamMemberInvitationDTO,
  ) {
    // Using an upsert to ensure that duplicates wont be created
    await this.db.team_member_invitation.upsert({
      create: {
        id: invitationID,
        invitee_email: createOneTeamMemberInvitationDTO.inviteeEmail,
        role: RoleTypeToDbRoleEnumMapping[
          createOneTeamMemberInvitationDTO.role
        ],
        inviter_id: inviterUserID,
        org_id,
      },
      where: { invitee_email: createOneTeamMemberInvitationDTO.inviteeEmail },
      // Only update inviterUserID to prevent a OrgID attack where someone from
      // another org can just invite the user to prevent them from joining the
      // original Org they were invited to.
      update: { inviter_id: inviterUserID },
    });

    return true;
  }

  async getPendingInvites(invitee_email: User['email']) {
    // Use of findMany is useless since a user can only join a single team now
    // this is only useful after allowing multiple teams in a single Org.
    return this.db.team_member_invitation
      .findMany({
        where: { invitee_email },
        include: {
          inviter: { select: { name: true, role: true } },
          org: { select: { name: true } },
        },
      })
      .then(mapToTeamInvitations);
  }

  async getInvite(invitationID: string) {
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

  async deleteInvite(invitationID: string) {
    await this.db.team_member_invitation.delete({
      where: { id: invitationID },
    });
  }

  // Delete Org related data for user before removing user
  async removeMember(userID: UserID) {
    await this.db.team_member_invitation.deleteMany({
      where: { inviter_id: userID },
    });

    await this.db.user.update({
      where: { id: userID },
      data: { org_id: null },
    });
  }
}
