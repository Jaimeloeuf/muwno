import {
  Catch,
  ArgumentsHost,
  NotFoundException as HTTPNotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { NotFoundException } from '../exceptions/index.js';

@Catch(NotFoundException)
export class NotFoundExceptionFilter extends BaseExceptionFilter {
  override catch(exception: NotFoundException, host: ArgumentsHost) {
    return super.catch(new HTTPNotFoundException(exception.message), host);
  }
}
