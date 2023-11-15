import { type Provider, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../config/types.js';

// Abstraction
import { IEmailBlastService } from '../abstractions/index.js';

// Implementation
import {
  PostmarkEmailBlastService,
  MockEmailBlastService,
} from '../implementations/index.js';

/**
 * Provides for `IEmailBlastService`
 */
export const EmailBlastServiceProvider = {
  provide: IEmailBlastService,
  inject: [ConfigService, Logger],
  useFactory: (
    configService: ConfigService<EnvironmentVariables, true>,
    logger: Logger,
  ) =>
    configService.get('NODE_ENV', { infer: true }) === 'production'
      ? new PostmarkEmailBlastService(configService)
      : new MockEmailBlastService(configService, logger),
} satisfies Provider;
