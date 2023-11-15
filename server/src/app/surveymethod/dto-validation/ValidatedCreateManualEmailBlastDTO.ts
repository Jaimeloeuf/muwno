import type { CreateManualEmailBlastDTO } from 'domain-model';
import {
  ValidatedCustomerEmailContact,
  CustomerEmailContact,
} from './ValidatedCustomerEmailContact.js';

import { ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * The TS not null assertion operator is used as these are supposed to be
 * validation DTO classes and do not need to be initialized by the user.
 */
export class ValidatedCreateManualEmailBlastDTO
  implements CreateManualEmailBlastDTO
{
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ValidatedCustomerEmailContact)
  readonly customers!: Array<CustomerEmailContact>;
}
