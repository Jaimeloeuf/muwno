import { Injectable, Logger } from '@nestjs/common';

import type {
  IEmailService,
  EmailObject,
} from '../../abstractions/IEmailService.js';

/**
 * MockEmailService implements the IEmailService to mock a email service while
 * doing testing by just logging all the requested emails to console.
 *
 * Use the IEmailService abstract class to get this email service injected.
 */
@Injectable()
export class MockEmailService implements IEmailService {
  constructor(private readonly logger: Logger) {}

  async sendOne(recipient: string, emailObject: EmailObject) {
    this.logger.debug(
      {
        To: recipient,
        From: emailObject.from,
        Subject: emailObject.subject,
        Body: emailObject.body,
      },
      MockEmailService.name,
    );

    return true;
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
