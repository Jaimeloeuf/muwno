import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
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
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly logger: Logger,
  ) {
    super(
      configService.get('PRISMA_VERBOSE', { infer: true })
        ? { log: ['query'] } // Log all queries in verbose mode
        : undefined,
    );
  }

  /**
   * This is optional, and when defined, `onModuleInit` method is called when
   * the GlobalModule is initialised.
   *
   * Depending on `NODE_ENV`, this may eagerly connect to the DB when the
   * application first starts as a simple preliminary DB health check instead of
   * lazily connecting only on its first use.
   */
  async onModuleInit() {
    // Only eagerly connect in production builds to ensure DB is up and running
    // as soon as possible, which will benefit long running deployments, but
    // lazily connect in non production builds to strain the serverless DB less.
    if (this.configService.get('NODE_ENV', { infer: true }) === 'production') {
      await this.$connect();
      this.logger.verbose('Eagerly connected to DB', PrismaService.name);
    } else {
      this.logger.verbose(
        'Waiting on first use to lazily connect to DB',
        PrismaService.name,
      );
    }
  }
}
