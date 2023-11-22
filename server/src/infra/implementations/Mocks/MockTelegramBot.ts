import { Injectable, Logger } from '@nestjs/common';

import type { ITelegramBotService } from '../../abstractions/ITelegramBotService.js';

/**
 * MockTelegramBotService implements the ITelegramBotService for testing by just
 * logging all the messages to console.
 */
@Injectable()
export class MockTelegramBotService implements ITelegramBotService {
  constructor(private readonly logger: Logger) {}

  async sendOne(recipient: string, message: string) {
    this.logger.debug(
      `Messaging ${recipient}`,
      message,
      `${MockTelegramBotService.name}.${MockTelegramBotService.prototype.sendOne.name}`,
    );
    return true;
  }

  async notifyAdmin(message: string) {
    this.sendOne('MOCK_ADMIN_CHAT_ID', message);
    return true;
  }
}
