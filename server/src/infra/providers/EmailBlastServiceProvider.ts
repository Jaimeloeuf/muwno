import { type Provider, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../config/types.js';

// Abstraction
import { IEmailBlastService } from '../abstractions/index.js';

// Implementation
import {
  PostmarkClient,
  PostmarkEmailBlastService,
  MockEmailBlastService,
} from '../implementations/index.js';

/**
 * Provides for `IEmailBlastService`
 */
export const EmailBlastServiceProvider = {
  provide: IEmailBlastService,
  inject: [ConfigService, Logger, PostmarkClient],
  useFactory: (
    configService: ConfigService<EnvironmentVariables, true>,
    logger: Logger,
    postmarkEmailClient: PostmarkClient,
  ) =>
    configService.get('NODE_ENV', { infer: true }) === 'production'
      ? new PostmarkEmailBlastService(configService, postmarkEmailClient)
      : new MockEmailBlastService(configService, logger),
} satisfies Provider;
