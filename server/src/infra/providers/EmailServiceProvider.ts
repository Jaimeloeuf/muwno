import type { Provider } from '@nestjs/common';

// Abstraction
import { IEmailService } from '../abstractions/index.js';

// Implementation
import { PostmarkEmailService } from '../implementations/index.js';

/**
 * Provides for `IEmailService`
 */
export const EmailServiceProvider = {
  provide: IEmailService,
  useClass: PostmarkEmailService,
} satisfies Provider;
