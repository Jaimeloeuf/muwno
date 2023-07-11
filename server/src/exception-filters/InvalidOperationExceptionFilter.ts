import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { InvalidOperationException } from '../exceptions/index.js';

@Catch(InvalidOperationException)
export class InvalidOperationExceptionFilter extends BaseExceptionFilter {
  override catch(exception: InvalidOperationException, host: ArgumentsHost) {
    return super.catch(new BadRequestException(exception.message), host);
  }
}
