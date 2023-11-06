import { type CreateOneOrgDTO, type OrgSize, orgSizes } from 'domain-model';

import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
  IsIn,
} from 'class-validator';

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

  // @todo Add phone validation
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly phone!: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  readonly address!: string | null;

  @IsIn(orgSizes)
  @IsOptional()
  readonly size!: OrgSize | null;
}
