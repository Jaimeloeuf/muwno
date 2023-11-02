import type { UpdateOneTaskDTO } from 'domain-model';

import { IsString, MaxLength } from 'class-validator';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedUpdateOneTaskDTO implements UpdateOneTaskDTO {
  @IsString()
  @MaxLength(3000)
  readonly task!: string;
}
