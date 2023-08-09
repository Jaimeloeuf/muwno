import type {
  OrgID,
  User,
  UserID,
  CreateOneTeamMemberInvitationDTO,
} from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * different Entity objects regardless of the underlying datasource.
 */
export abstract class ITeamRepo {
  /**
   * Get all members of the Org team.
   */
  abstract getAllMembers(orgID: OrgID): Promise<Array<User>>;

  /**
   * Create and save a team member invite into data source.
   */
  abstract createInvite(
    inviterUserID: UserID,
    orgID: OrgID,
    createOneTeamMemberInvitationDTO: CreateOneTeamMemberInvitationDTO,
  ): Promise<boolean>;
}
