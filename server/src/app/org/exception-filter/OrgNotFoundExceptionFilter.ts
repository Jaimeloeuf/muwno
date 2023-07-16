import { Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { OrgNotFoundException } from '../exceptions/index.js';

@Catch(OrgNotFoundException)
export class OrgNotFoundExceptionFilter extends BaseExceptionFilter {
  override catch(exception: OrgNotFoundException, host: ArgumentsHost) {
    return super.catch(new NotFoundException(exception.message), host);
  }
}
