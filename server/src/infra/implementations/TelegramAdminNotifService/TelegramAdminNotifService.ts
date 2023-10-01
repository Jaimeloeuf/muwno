import { Injectable } from '@nestjs/common';

import type { CreateOneContactFormSubmissionDTO } from 'domain-model';

import type {
  IAdminNotifService,
  ITelegramBotService,
} from '../../abstractions/index.js';

@Injectable()
export class TelegramAdminNotifService implements IAdminNotifService {
  constructor(private readonly telegramBotService: ITelegramBotService) {}

  async landingPageContactForm(details: CreateOneContactFormSubmissionDTO) {
    return this.telegramBotService.notifyAdmin(`<b>Landing page Contact Form</b>

Name: ${details.name}
Email: ${details.email}
Message: ${details.message}`);
  }
}
