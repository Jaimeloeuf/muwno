import {
  Catch,
  ArgumentsHost,
  ConflictException as HTTPConflictException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { ConflictException } from '../exceptions/index.js';

@Catch(ConflictException)
export class ConflictExceptionFilter extends BaseExceptionFilter {
  override catch(exception: ConflictException, host: ArgumentsHost) {
    return super.catch(new HTTPConflictException(exception.message), host);
  }
}
