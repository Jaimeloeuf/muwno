import {
  Catch,
  ArgumentsHost,
  Logger,
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

    return super.catch(
      new InternalServerErrorException(`DB Exception Code: ${exception.code}`),
      host,
    );
  }
}
