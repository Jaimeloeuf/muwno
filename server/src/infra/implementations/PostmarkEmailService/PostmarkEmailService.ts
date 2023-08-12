import { Injectable } from '@nestjs/common';
import { ServerClient } from 'postmark';

import type {
  IEmailService,
  EmailObject,
} from '../../abstractions/IEmailService.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

/**
 * PostmarkEmailService implements the IEmailService used for sending emails and
 * this service can be injected to wherever it is needed as this should be
 * registered with the GlobalModule.
 *
 * Use the IEmailService abstract class to get this email service injected.
 */
@Injectable()
export class PostmarkEmailService implements IEmailService {
  /**
   * Postmark Server Client instance variable to cache it so that it is only
   * created once and reused.
   */
  private client: ServerClient;

  constructor(
    // private readonly logger: Logger,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.client = new ServerClient(
      this.configService.get('POSTMARK_API_KEY', { infer: true }),
    );
  }

  async sendOne(recipient: string, emailObject: EmailObject) {
    const emailResponse = await this.client.sendEmail({
      To: recipient,
      From: emailObject.from,
      Subject: emailObject.subject,
      HtmlBody: emailObject.body,
      MessageStream: 'outbound',
    });

    return emailResponse.ErrorCode === 0;
  }

  /**
   * Implements `sendMany` email by wrapping over `sendOne` method.
   */
  async sendMany(recipients: Array<string>, emailObject: EmailObject) {
    try {
      // If any one of the email fails to send, treat all as failed.
      await Promise.all(
        recipients.map((recipient) => this.sendOne(recipient, emailObject)),
      );

      return true;
    } catch (error) {
      return false;
    }
  }
}
