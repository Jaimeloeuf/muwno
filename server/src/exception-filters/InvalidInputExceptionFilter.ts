import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { InvalidInputException } from '../exceptions/index.js';

@Catch(InvalidInputException)
export class InvalidInputExceptionFilter extends BaseExceptionFilter {
  override catch(exception: InvalidInputException, host: ArgumentsHost) {
    return super.catch(new BadRequestException(exception.message), host);
  }
}
