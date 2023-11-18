import { type Provider, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../config/types.js';

// Abstraction
import { IMeteringService } from '../abstractions/index.js';

// Implementation
import {
  OpenMeterService,
  MockMeteringService,
} from '../implementations/index.js';

/**
 * Provides for `IMeteringService`
 */
export const MeteringServiceProvider = {
  provide: IMeteringService,
  inject: [ConfigService, Logger],
  useFactory: (
    configService: ConfigService<EnvironmentVariables, true>,
    logger: Logger,
  ) =>
    configService.get('NODE_ENV', { infer: true }) === 'production'
      ? new OpenMeterService(logger, configService)
      : new MockMeteringService(logger),
} satisfies Provider;
