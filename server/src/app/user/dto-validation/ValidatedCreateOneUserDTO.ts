import type { CreateOneUserDTO } from 'domain-model';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedCreateOneUserDTO implements CreateOneUserDTO {
  @IsString()
  @MaxLength(80)
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  readonly phone?: string;
}
