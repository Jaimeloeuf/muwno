import { UseFilters } from '@nestjs/common';

import { NotFoundExceptionFilter } from './NotFoundExceptionFilter.js';
import { ForbiddenExceptionFilter } from './ForbiddenExceptionFilter.js';
import { InvalidInputExceptionFilter } from './InvalidInputExceptionFilter.js';
import { InvalidOperationExceptionFilter } from './InvalidOperationExceptionFilter.js';
import { InvalidInternalStateExceptionFilter } from './InvalidInternalStateExceptionFilter.js';

/**
 * Exception Filter Decorator for all the HTTP Controllers to use, where all the
 * standard shared/common exceptions and their filters are all applied so
 * controllers and controller methods do not need to apply them individually.
 *
 * Apply this decorator to a Controller class directly and this will catch any
 * of the shared/common exceptions thrown from the service layer.
 */
export const UseHttpControllerFilters = UseFilters(
  NotFoundExceptionFilter,
  ForbiddenExceptionFilter,
  InvalidInputExceptionFilter,
  InvalidOperationExceptionFilter,
  InvalidInternalStateExceptionFilter,
);
