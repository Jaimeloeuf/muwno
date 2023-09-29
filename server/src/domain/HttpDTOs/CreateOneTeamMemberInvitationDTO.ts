import type { User } from '../User/index.js';

/**
 * DTO data used to create a single Team Member Invitation.
 */
export type CreateOneTeamMemberInvitationDTO = {
  inviteeEmail: User['email'];
};
