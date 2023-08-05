import type { Provider } from '@nestjs/common';

// Abstraction
import { ITelegramBotService } from '../abstractions/index.js';

// Implementation
import { TelegramBotService } from '../implementations/index.js';

/**
 * Provides for `ITelegramBotService`
 */
export const TelegramBotProvider = {
  provide: ITelegramBotService,
  useClass: TelegramBotService,
} satisfies Provider;
