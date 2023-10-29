import { Injectable, Logger } from '@nestjs/common';

import type { ITransactionalEmailService } from '../../abstractions/ITransactionalEmailService.js';

/**
 * MockTransactionalEmailService implements the ITransactionalEmailService to
 * mock a transactional email service while doing testing by just logging all
 * the requested emails to console.
 */
@Injectable()
export class MockTransactionalEmailService
  implements ITransactionalEmailService
{
  constructor(private readonly logger: Logger) {}

  private async send(recipient: string, subject: string, body: string) {
    this.logger.debug(
      {
        // @todo Set this with env var
        From: 'robot@muwno.com',
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
