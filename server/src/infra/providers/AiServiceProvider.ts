import type { Provider } from '@nestjs/common';

// Abstraction
import { IAiService } from '../abstractions/index.js';

// Implementation
import { OpenAIService } from '../implementations/index.js';

/**
 * Provides for `IAiService`
 */
export const AiServiceProvider = {
  provide: IAiService,
  useClass: OpenAIService,
} satisfies Provider;
