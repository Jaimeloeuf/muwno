import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

/**
 * Prisma client exception filter to ensure that if Prisma throws any exceptions
 * it will not crash the main server process, and give clients a more readable
 * exception message.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  override catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    return super.catch(exception, host);
  }
}
