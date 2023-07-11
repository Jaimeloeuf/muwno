import {
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { InvalidInternalStateException } from '../exceptions/index.js';

@Catch(InvalidInternalStateException)
export class InvalidInternalStateExceptionFilter extends BaseExceptionFilter {
  override catch(
    exception: InvalidInternalStateException,
    host: ArgumentsHost,
  ) {
    return super.catch(
      new InternalServerErrorException(exception.message),
      host,
    );
  }
}
