import type { TeamInvitation } from '../User/index.js';

/**
 * DTO data used to create a single Team Member Invitation.
 */
export type CreateOneTeamMemberInvitationDTO = {
  inviteeEmail: TeamInvitation['inviteeEmail'];
  role: TeamInvitation['role'];
};
