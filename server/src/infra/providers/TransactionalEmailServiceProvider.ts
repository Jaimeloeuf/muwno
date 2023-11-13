import { type Provider, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../config/types.js';

// Abstraction
import { ITransactionalEmailService } from '../abstractions/index.js';

// Implementation
import {
  PostmarkClient,
  PostmarkTransactionalEmailService,
  MockTransactionalEmailService,
} from '../implementations/index.js';

/**
 * Provides for `ITransactionalEmailService`
 */
export const TransactionalEmailServiceProvider = {
  provide: ITransactionalEmailService,
  inject: [ConfigService, Logger, PostmarkClient],
  useFactory: (
    configService: ConfigService<EnvironmentVariables, true>,
    logger: Logger,
    postmarkClient: PostmarkClient,
  ) =>
    configService.get('NODE_ENV', { infer: true }) === 'production'
      ? new PostmarkTransactionalEmailService(configService, postmarkClient)
      : new MockTransactionalEmailService(configService, logger),
} satisfies Provider;
