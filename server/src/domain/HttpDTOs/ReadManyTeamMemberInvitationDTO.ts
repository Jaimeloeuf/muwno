import type { TeamInvitation } from '../User/index.js';

/**
 * DTO data used to Read many Team Member Invitation from API service.
 */
export type ReadManyTeamMemberInvitationDTO = {
  invitations: Array<TeamInvitation>;
};
