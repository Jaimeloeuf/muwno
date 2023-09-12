import type { CreateOneFeedbackResponseDTO } from 'domain-model';

import {
  IsNumber,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedCreateOneFeedbackResponseDTO
  implements CreateOneFeedbackResponseDTO
{
  @IsNumber()
  @IsIn([1, 2, 3])
  @IsNotEmpty()
  readonly a1!: 1 | 2 | 3;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  readonly a2!: string;

  @IsString()
  @MaxLength(3000)
  @IsOptional()
  readonly a3!: string;

  @IsString()
  @MaxLength(3000)
  @IsOptional()
  readonly a4!: string;
}
