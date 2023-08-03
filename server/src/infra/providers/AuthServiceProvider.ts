import type { Provider } from '@nestjs/common';

// Abstraction
import { IAuthService } from '../abstractions/index.js';

// Implementation
import { FirebaseAuthService } from '../implementations/index.js';

/**
 * Provides for `IAuthService`
 */
export const AuthServiceProvider = {
  provide: IAuthService,
  useFactory: FirebaseAuthService.create,
} satisfies Provider;
