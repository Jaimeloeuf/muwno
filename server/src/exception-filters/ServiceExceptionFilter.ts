import {
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { ServiceException } from '../exceptions/index.js';

@Catch(ServiceException)
export class ServiceExceptionFilter extends BaseExceptionFilter {
  override catch(exception: ServiceException, host: ArgumentsHost) {
    return super.catch(
      new InternalServerErrorException(exception.message),
      host,
    );
  }
}
