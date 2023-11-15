import { Injectable } from '@nestjs/common';
import type { ServerClient, Message } from 'postmark';
import { PostmarkClientSingleton } from './PostmarkClient.js';

import type { IEmailBlastService } from '../../abstractions/IEmailBlastService.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

@Injectable()
export class PostmarkEmailBlastService implements IEmailBlastService {
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

    this.senderAddress = configService.get('EMAIL_BLAST_ADDRESS', {
      infer: true,
    });

    this.replyAddress = configService.get('EMAIL_BLAST_REPLY', {
      infer: true,
    });
  }

  async sendBatch(
    emailMessages: Array<{ to: string; subject: string; body: string }>,
  ) {
    const baseMessage = {
      From: this.senderAddress,
      ReplyTo: this.replyAddress,
      MessageStream: 'broadcast',
    } satisfies Partial<Message>;

    const emailResponses = await this.client.sendEmailBatch(
      emailMessages.map(({ to: To, subject: Subject, body: HtmlBody }) => ({
        ...baseMessage,
        To,
        Subject,
        HtmlBody,
      })),
    );

    // Treat as success only if every single email is successfully sent
    return emailResponses.every(
      (emailResponse) => emailResponse.ErrorCode === 0,
    );
  }
}
