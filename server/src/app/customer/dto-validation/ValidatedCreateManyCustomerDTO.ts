import type { CreateManyCustomerDTO, CreateOneCustomerDTO } from 'domain-model';
import { ValidatedCreateOneCustomerDTO } from './ValidatedCreateOneCustomerDTO.js';

import { ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedCreateManyCustomerDTO implements CreateManyCustomerDTO {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ValidatedCreateOneCustomerDTO)
  readonly customers!: Array<CreateOneCustomerDTO>;
}
