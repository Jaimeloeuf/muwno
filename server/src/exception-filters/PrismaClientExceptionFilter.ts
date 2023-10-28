import {
  Catch,
  ArgumentsHost,
  Logger,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

/**
 * Prisma client exception filter to ensure that if Prisma throws any exceptions
 * it will not crash the main server process, and give clients a more readable
 * exception message.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  constructor() {
    super();
    this.logger = new Logger(PrismaClientExceptionFilter.name);
  }

  private readonly logger: Logger;

  override catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    this.logger.error(`Code: ${exception.code}`, exception);

    if (exception.code === 'P2002')
      return super.catch(
        new ConflictException(
          `PK contraint error: Failed to create resource as '${exception.meta?.['target']}' needs to be unique`,
        ),
        host,
      );

    if (exception.code === 'P2003')
      return super.catch(
        new BadRequestException(
          `FK contraint error: Failed to create resource as '${exception.meta?.['field_name']}' is invalid`,
        ),
        host,
      );

    // Fallback if the specific code is not dealt with using a custom exception.
    return super.catch(
      new InternalServerErrorException(`DB Exception Code: ${exception.code}`),
      host,
    );
  }
}
