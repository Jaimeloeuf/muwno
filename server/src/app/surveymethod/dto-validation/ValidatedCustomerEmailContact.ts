import type { CreateManualEmailBlastDTO } from 'domain-model';

import { IsString, MaxLength, IsEmail, ValidateIf } from 'class-validator';

export type CustomerEmailContact =
  CreateManualEmailBlastDTO['customers'][number];

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedCustomerEmailContact implements CustomerEmailContact {
  @IsString()
  @MaxLength(254)
  @IsEmail()
  readonly email!: string;

  @IsString()
  @MaxLength(120)
  // Allow value to be nullable by skipping all checks if it is null
  @ValidateIf((_, value) => value !== null)
  readonly name!: string | null;
}
