import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

/**
 * PrismaService wraps around the PrismaClient so that it can be injected to
 * wherever this is needed as this should be registered with the GlobalModule.
 *
 * Although DI can be done using a simple custom `ClassProvider<PrismaClient>`,
 * doing that will mean that the class cannot be extended, and the client needs
 * to be extended for it to work with NestJS properly.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    // Turn on verbose mode if env var passed in
    if (configService.get('PRISMA_VERBOSE', { infer: true })) {
      super({ log: ['query'] });
    } else {
      super();
    }
  }

  /**
   * This is optional, and when defined, `onModuleInit` method is called when the
   * GlobalModule is initialised. If this is not implemented, Prisma will connect
   * lazily on its first call to the database.
   *
   * Right now this is implemented to ensure that the DB can be connected the
   * moment the service is started, without waiting for the first call to come
   * through as a simple preliminary DB health check.
   */
  async onModuleInit() {
    await this.$connect();
  }
}
