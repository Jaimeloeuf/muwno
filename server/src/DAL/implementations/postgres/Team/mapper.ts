import type {
  user as UserModel,
  team_member_invitation as TeamMemberInvitationModel,
  org as OrgModel,
} from '@prisma/client';
import type { User, TeamInvitation } from 'domain-model';
import { mapUserModelToEntity } from '../User/mapper.js';
import { DbRoleEnumToRoleTypeMapping } from '../utils/dbRoleMapper.js';
import { InvalidInternalStateException } from '../../../../exceptions/index.js';

export const mapUserModelsToEntity = (
  userModels: Array<UserModel>,
): Array<User> => userModels.map(mapUserModelToEntity);

export function mapToTeamInvitation(
  invite: TeamMemberInvitationModel & {
    inviter: Pick<UserModel, 'name' | 'role'>;
    org: Pick<OrgModel, 'name'>;
  },
): TeamInvitation {
  if (invite.inviter.role === null)
    throw new InvalidInternalStateException(
      `${invite.invitee_email}'s inviter's role is null`,
    );

  return {
    id: invite.id,
    createdAt: invite.created_at.toISOString(),
    inviteeEmail: invite.invitee_email,
    role: DbRoleEnumToRoleTypeMapping[invite.role],
    inviter: {
      name: invite.inviter.name,
      role: DbRoleEnumToRoleTypeMapping[invite.inviter.role],
    },
    team: {
      id: invite.org_id,
      name: invite.org.name,
    },
  };
}

export const mapToTeamInvitations = (
  inviteModels: Array<
    TeamMemberInvitationModel & {
      inviter: Pick<UserModel, 'name' | 'role'>;
      org: Pick<OrgModel, 'name'>;
    }
  >,
): Array<TeamInvitation> => inviteModels.map(mapToTeamInvitation);
