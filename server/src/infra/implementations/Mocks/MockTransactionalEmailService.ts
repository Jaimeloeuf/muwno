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

  async email(To: string, Subject: string, HtmlBody: string) {
    this.logger.debug(
      {
        From: this.senderAddress,
        ReplyTo: this.replyAddress,

        To,
        Subject,
        HtmlBody,
      },
      `${MockTransactionalEmailService.name}.${MockTransactionalEmailService.prototype.email.name}`,
    );

    return true;
  }
}
