import type { Provider } from '@nestjs/common';

// Abstraction
import { IAdminNotifService } from '../abstractions/index.js';

// Implementation
import { TelegramAdminNotifService } from '../implementations/index.js';

/**
 * Provides for `IAdminNotifService`
 */
export const AdminNotifServiceProvider = {
  provide: IAdminNotifService,
  useClass: TelegramAdminNotifService,
} satisfies Provider;
