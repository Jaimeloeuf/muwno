import type { CreateOneOrgDTO } from 'domain-model';

import { IsNotEmpty, IsString, MaxLength, IsEmail } from 'class-validator';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedCreateOneOrgDTO implements CreateOneOrgDTO {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @MaxLength(254)
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;
}
