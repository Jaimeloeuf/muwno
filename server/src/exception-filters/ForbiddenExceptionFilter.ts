import {
  Catch,
  ArgumentsHost,
  ForbiddenException as HTTPForbiddenException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { ForbiddenException } from '../exceptions/index.js';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter extends BaseExceptionFilter {
  override catch(exception: ForbiddenException, host: ArgumentsHost) {
    return super.catch(new HTTPForbiddenException(exception.message), host);
  }
}
