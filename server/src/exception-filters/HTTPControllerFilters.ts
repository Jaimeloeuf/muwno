import { UseFilters } from '@nestjs/common';

/* Exception filters for generic service level exceptions */
import { ServiceExceptionFilter } from './ServiceExceptionFilter.js';
import { ConflictExceptionFilter } from './ConflictExceptionFilter.js';
import { NotFoundExceptionFilter } from './NotFoundExceptionFilter.js';
import { ForbiddenExceptionFilter } from './ForbiddenExceptionFilter.js';
import { InvalidInputExceptionFilter } from './InvalidInputExceptionFilter.js';
import { InvalidOperationExceptionFilter } from './InvalidOperationExceptionFilter.js';
import { InvalidInternalStateExceptionFilter } from './InvalidInternalStateExceptionFilter.js';

/* Custom exception filters from other sources */
import { PrismaClientExceptionFilter } from './PrismaClientExceptionFilter.js';
import { FirebaseAuthExceptionFilter } from '../infra/implementations/index.js';

/**
 * Exception Filter Decorator for all the HTTP Controllers to use, where all the
 * standard shared/common exceptions and their filters are all applied so
 * controllers and controller methods do not need to apply them individually.
 *
 * Apply this decorator to a Controller class directly and this will catch any
 * of the shared/common exceptions thrown from the service layer.
 */
export const UseHttpControllerFilters = UseFilters(
  // Generic exception filters
  ServiceExceptionFilter,
  ConflictExceptionFilter,
  NotFoundExceptionFilter,
  ForbiddenExceptionFilter,
  InvalidInputExceptionFilter,
  InvalidOperationExceptionFilter,
  InvalidInternalStateExceptionFilter,

  // Custom exception filters
  PrismaClientExceptionFilter,
  FirebaseAuthExceptionFilter,
);
