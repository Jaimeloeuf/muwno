import { Injectable, Logger } from '@nestjs/common';

import type { IEmailBlastService } from '../../abstractions/IEmailBlastService.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

/**
 * MockEmailBlastService implements the IEmailBlastService to mock it for
 * testing by logging all the requested email blasts to console.
 */
@Injectable()
export class MockEmailBlastService implements IEmailBlastService {
  /**
   * Email address used for the sender/from.
   */
  private readonly senderAddress: string;

  /**
   * Email address used for reply to field.
   */
  private readonly replyAddress: string;

  constructor(
    configService: ConfigService<EnvironmentVariables, true>,
    private readonly logger: Logger,
  ) {
    this.senderAddress = configService.get('EMAIL_BLAST_ADDRESS', {
      infer: true,
    });

    this.replyAddress = configService.get('EMAIL_BLAST_REPLY', {
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
      MockEmailBlastService.name,
    );

    return true;
  }
}
