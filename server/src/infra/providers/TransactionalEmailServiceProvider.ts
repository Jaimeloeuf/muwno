import { type Provider, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../config/types.js';

// Abstraction
import { ITransactionalEmailService } from '../abstractions/index.js';

// Implementation
import {
  PostmarkTransactionalEmailService,
  MockTransactionalEmailService,
} from '../implementations/index.js';

/**
 * Provides for `ITransactionalEmailService`
 */
export const TransactionalEmailServiceProvider = {
  provide: ITransactionalEmailService,
  inject: [ConfigService, Logger],
  useFactory: (
    configService: ConfigService<EnvironmentVariables, true>,
    logger: Logger,
  ) =>
    configService.get('NODE_ENV', { infer: true }) === 'production'
      ? new PostmarkTransactionalEmailService(configService)
      : new MockTransactionalEmailService(logger),
} satisfies Provider;
