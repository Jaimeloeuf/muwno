import { Injectable } from '@nestjs/common';
import { ServerClient } from 'postmark';
import { PostmarkClientSingleton } from './PostmarkClient.js';

import type { ITransactionalEmailService } from '../../abstractions/ITransactionalEmailService.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

@Injectable()
export class PostmarkTransactionalEmailService
  implements ITransactionalEmailService
{
  /**
   * Postmark client
   */
  private readonly client: ServerClient;

  /**
   * Email address used for the sender/from.
   */
  private readonly senderAddress: string;

  /**
   * Email address used for reply to field.
   */
  private readonly replyAddress: string;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    this.client = PostmarkClientSingleton.getClient(configService);

    this.senderAddress = configService.get('EMAIL_TRANSACTIONAL_ADDRESS', {
      infer: true,
    });

    this.replyAddress = configService.get('EMAIL_TRANSACTIONAL_REPLY', {
      infer: true,
    });
  }

  async email(To: string, Subject: string, HtmlBody: string) {
    const emailResponse = await this.client.sendEmail({
      From: this.senderAddress,
      ReplyTo: this.replyAddress,
      MessageStream: 'outbound',

      To,
      Subject,
      HtmlBody,
    });

    return emailResponse.ErrorCode === 0;
  }
}
