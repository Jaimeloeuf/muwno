import type { CreateOneTeamMemberInvitationDTO } from 'domain-model';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedCreateOneTeamMemberInvitationDTO
  implements CreateOneTeamMemberInvitationDTO
{
  @IsString()
  @MaxLength(120)
  @IsNotEmpty()
  readonly inviteeEmail!: string;
}
