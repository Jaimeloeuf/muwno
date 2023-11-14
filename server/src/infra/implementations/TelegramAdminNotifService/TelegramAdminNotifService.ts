import { Injectable } from '@nestjs/common';

import {
  type IAdminNotifService,
  ITelegramBotService,
} from '../../abstractions/index.js';

@Injectable()
export class TelegramAdminNotifService implements IAdminNotifService {
  constructor(private readonly telegramBotService: ITelegramBotService) {}

  async send(msg: string) {
    return this.telegramBotService.notifyAdmin(msg);
  }
}
