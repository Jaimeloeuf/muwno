import type { CreateOneCustomerDTO } from 'domain-model';

import {
  IsString,
  MaxLength,
  IsEmail,
  IsISO8601,
  ValidateIf,
} from 'class-validator';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedCreateOneCustomerDTO implements CreateOneCustomerDTO {
  @IsString()
  @MaxLength(100)
  // Allow value to be nullable by skipping all checks if it is null
  @ValidateIf((_, value) => value !== null)
  readonly cid!: string | null;

  @IsString()
  @MaxLength(120)
  // Allow value to be nullable by skipping all checks if it is null
  @ValidateIf((_, value) => value !== null)
  readonly name!: string | null;

  @IsString()
  @MaxLength(254)
  @IsEmail()
  // Allow value to be nullable by skipping all checks if it is null
  @ValidateIf((_, value) => value !== null)
  readonly email!: string | null;

  // @todo Add phone validation
  @IsString()
  @MaxLength(30)
  // Allow value to be nullable by skipping all checks if it is null
  @ValidateIf((_, value) => value !== null)
  readonly phone!: string | null;

  @IsISO8601({ strict: true })
  // Allow value to be nullable by skipping all checks if it is null
  @ValidateIf((_, value) => value !== null)
  readonly createdAt!: string | null;
}
