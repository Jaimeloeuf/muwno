import { Injectable, Logger } from '@nestjs/common';

import type { ITransactionalEmailService } from '../../abstractions/ITransactionalEmailService.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

/**
 * MockTransactionalEmailService implements the ITransactionalEmailService to
 * mock a transactional email service while doing testing by just logging all
 * the requested emails to console.
 */
@Injectable()
export class MockTransactionalEmailService
  implements ITransactionalEmailService
{
  /**
   * Email address used for the sender/from.
   */
  private senderAddress: string;

  /**
   * Email address used for reply to field.
   */
  private readonly replyAddress: string;

  constructor(
    configService: ConfigService<EnvironmentVariables, true>,
    private readonly logger: Logger,
  ) {
    this.senderAddress = configService.get('EMAIL_TRANSACTIONAL_ADDRESS', {
      infer: true,
    });

    this.replyAddress = configService.get('EMAIL_TRANSACTIONAL_REPLY', {
      infer: true,
    });
  }

  private async send(recipient: string, subject: string, body: string) {
    this.logger.debug(
      {
        From: this.senderAddress,
        ReplyTo: this.replyAddress,
        To: recipient,
        Subject: subject,
        HtmlBody: body,
      },
      MockTransactionalEmailService.name,
    );

    return true;
  }

  async teamInvite(
    recipientEmail: string,
    inviterName: string,
    orgName: string,
  ) {
    return this.send(recipientEmail, inviterName, orgName);
  }

  async welcomeNewUser(recipientEmail: string, name: string) {
    return this.send(recipientEmail, name, name);
  }

  async newOrgCreated(recipientEmail: string, orgName: string) {
    return this.send(recipientEmail, orgName, orgName);
  }
}
