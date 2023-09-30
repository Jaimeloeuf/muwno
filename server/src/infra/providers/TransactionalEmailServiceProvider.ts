import type { Provider } from '@nestjs/common';

// Abstraction
import { ITransactionalEmailService } from '../abstractions/index.js';

// Implementation
import { PostmarkTransactionalEmailService } from '../implementations/index.js';

/**
 * Provides for `ITransactionalEmailService`
 */
export const TransactionalEmailServiceProvider = {
  provide: ITransactionalEmailService,
  useClass: PostmarkTransactionalEmailService,
} satisfies Provider;
