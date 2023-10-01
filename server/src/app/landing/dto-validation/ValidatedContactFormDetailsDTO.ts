import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import type { CreateOneContactFormSubmissionDTO } from 'domain-model';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedContactFormDetailsDTO
  implements CreateOneContactFormSubmissionDTO
{
  @IsString()
  @MaxLength(80)
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @MaxLength(3000)
  @IsOptional()
  readonly message!: string;
}
