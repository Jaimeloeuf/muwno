import { Injectable } from '@nestjs/common';
import { ServerClient } from 'postmark';

import type { ITransactionalEmailService } from '../../abstractions/ITransactionalEmailService.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

@Injectable()
export class PostmarkTransactionalEmailService
  implements ITransactionalEmailService
{
  /**
   * Postmark Server Client instance variable to cache it so that it is only
   * created once and reused.
   */
  private client: ServerClient;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.client = new ServerClient(
      this.configService.get('POSTMARK_API_KEY', { infer: true }),
    );
  }

  private async send(recipient: string, subject: string, body: string) {
    const emailResponse = await this.client.sendEmail({
      // @todo Set this with env var
      From: 'robot@muwno.com',
      To: recipient,
      Subject: subject,
      HtmlBody: body,
      MessageStream: 'outbound',
    });

    return emailResponse.ErrorCode === 0;
  }

  async teamInvite(
    recipientEmail: string,
    inviterName: string,
    orgName: string,
  ) {
    return this.send(
      recipientEmail,
      `${inviterName} invited you to join ${orgName}`,
      `Hello, this is the robot from <a target="_blank" href="https://muwno.com"><b>muwno</b></a>!
<br /><br />
${inviterName} has invited you to join ${orgName}, click the link to signup for an account to join the team!
<br />
<a target="_blank" href="https://portal.muwno.com/#/signup">https://portal.muwno.com/#/signup</a>`,
    );
  }

  async welcomeNewUser(recipientEmail: string, name: string) {
    return this.send(
      recipientEmail,
      `Hey ${name}, welcome to muwno!`,
      `Hey ${name},
<br />
Welcome to <a target="_blank" href="https://muwno.com"><b>muwno</b></a>!
You are now a part of the community of business owners, product managers, marketers and tech leads who are bringing their products to Product Market Fit.
<br /><br />
Enjoy the journey to Product Market Fit by learning what your customers would pay for!
<br />
Email us at help@muwno.com for anything you need help with!`,
    );
  }

  async newOrgCreated(recipientEmail: string, orgName: string) {
    return this.send(
      recipientEmail,
      `Hey ${orgName}, welcome to muwno!`,
      `Hey ${orgName},
<br />
Welcome to <a target="_blank" href="https://muwno.com"><b>muwno</b></a>!
You are now a part of the community of business owners, product managers, marketers and tech leads who are bringing their products to Product Market Fit.
<br /><br />
Enjoy the journey to Product Market Fit by learning what your customers would pay for!
<br />
Email us at help@muwno.com for anything you need help with!`,
    );
  }
}
