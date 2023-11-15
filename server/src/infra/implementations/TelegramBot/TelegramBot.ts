import { Injectable } from '@nestjs/common';
import TinyJsonHttp from 'tiny-json-http';

import type { ITelegramBotService } from '../../abstractions/ITelegramBotService.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

@Injectable()
export class TelegramBotService implements ITelegramBotService {
  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    // These env var are optional and only checked here, as they are not
    // required for local dev since this service will be mocked.

    const TELE_BOT_TOKEN = configService.get('TELE_BOT_TOKEN', { infer: true });
    if (TELE_BOT_TOKEN === undefined)
      throw new Error(
        `env var 'TELE_BOT_TOKEN' cannot be undefined in Production`,
      );

    const TELE_ADMIN_CHAT_ID = configService.get('TELE_ADMIN_CHAT_ID', {
      infer: true,
    });
    if (TELE_ADMIN_CHAT_ID === undefined)
      throw new Error(
        `env var 'TELE_ADMIN_CHAT_ID' cannot be undefined in Production`,
      );

    this.apiUrl = `https://api.telegram.org/bot${TELE_BOT_TOKEN}/`;
    this.TELE_ADMIN_CHAT_ID = TELE_ADMIN_CHAT_ID;
  }

  /**
   * Base URL of the Telegram API service
   */
  private readonly apiUrl: string;

  /**
   * Chat ID of the team's telegram admin chat for notifications.
   */
  private readonly TELE_ADMIN_CHAT_ID: string;

  /**
   * Simple wrapper to call the sendMessage API.
   *
   * Using HTML for formmating instead of MarkdownV2 due to the restrictions in
   * place for parsing markdown text. Especially when trying to send user input
   * directly to telegram API, it may crash as user may use special reserved
   * characters and cause server the crash. Thus the fix to this is just use
   * HTML formatting instead.
   *
   * See links below for reference on this issue.
   * https://core.telegram.org/bots/api#markdownv2-style
   * https://stackoverflow.com/questions/62600596/why-is-a-reserved-character-in-markdownv2-in-telegrams-bot-api
   * https://github.com/telegraf/telegraf/issues/1242
   *
   * @param {String} message Notification message (HTML format) to send
   */
  async sendOne(recipient: string, message: string) {
    await TinyJsonHttp.post({
      url: `${this.apiUrl}sendMessage`,
      data: {
        chat_id: recipient,
        text: message,
        parse_mode: 'HTML',
      },
    }).then((res) => res.body);

    return true;
  }

  async notifyAdmin(message: string) {
    return this.sendOne(this.TELE_ADMIN_CHAT_ID, message);
  }
}
