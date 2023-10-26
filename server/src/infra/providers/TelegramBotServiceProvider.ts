import { type Provider, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../config/types.js';

// Abstraction
import { ITelegramBotService } from '../abstractions/index.js';

// Implementation
import {
  TelegramBotService,
  MockTelegramBotService,
} from '../implementations/index.js';

export const TelegramBotProvider = {
  provide: ITelegramBotService,
  inject: [ConfigService, Logger],
  useFactory: (
    configService: ConfigService<EnvironmentVariables, true>,
    logger: Logger,
  ) =>
    configService.get('NODE_ENV', { infer: true }) === 'production'
      ? new TelegramBotService(configService)
      : new MockTelegramBotService(logger),
} satisfies Provider;
