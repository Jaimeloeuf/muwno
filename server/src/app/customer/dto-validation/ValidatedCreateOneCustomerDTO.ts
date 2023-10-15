import type { CreateOneCustomerDTO } from 'domain-model';

import { IsString, MaxLength, IsEmail, IsOptional } from 'class-validator';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedCreateOneCustomerDTO implements CreateOneCustomerDTO {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  readonly cid!: string;

  @IsString()
  @MaxLength(120)
  @IsOptional()
  readonly name!: string | null;

  @IsString()
  @MaxLength(254)
  @IsEmail()
  @IsOptional()
  readonly email!: string | null;

  // @todo Add phone validation
  @IsString()
  @MaxLength(30)
  @IsOptional()
  readonly phone!: string | null;
}
