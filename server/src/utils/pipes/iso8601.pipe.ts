import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isISO8601 } from 'class-validator';
import type { ISODateTimeString } from 'domain-model';

@Injectable()
export class ValidateISO8601IfFoundPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // If there is no value passed in for validation, then return undefined
    // as this will only error out if there is a value and it is not ISO8061
    if (value === undefined) return undefined;

    if (isISO8601(value)) return value as ISODateTimeString;

    throw new BadRequestException(
      `Validation Failed: Expect '${metadata.type}' '${metadata.data}' to be an ISO8601 DateTime String`,
    );
  }
}
