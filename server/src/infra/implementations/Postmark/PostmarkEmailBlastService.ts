import { Injectable } from '@nestjs/common';
import { ServerClient } from 'postmark';

import type { IEmailBlastService } from '../../abstractions/IEmailBlastService.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

@Injectable()
export class PostmarkEmailBlastService implements IEmailBlastService {
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
    private readonly client: ServerClient,
  ) {
    this.senderAddress = configService.get('EMAIL_BLAST_ADDRESS', {
      infer: true,
    });

    this.replyAddress = configService.get('EMAIL_BLAST_REPLY', {
      infer: true,
    });
  }

  private async send(recipient: string, subject: string, body: string) {
    const emailResponse = await this.client.sendEmail({
      From: this.senderAddress,
      ReplyTo: this.replyAddress,
      To: recipient,
      Subject: subject,
      HtmlBody: body,
      MessageStream: 'broadcast',
    });

    return emailResponse.ErrorCode === 0;
  }
}
