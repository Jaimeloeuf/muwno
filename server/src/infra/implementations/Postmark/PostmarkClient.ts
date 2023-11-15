import { ServerClient } from 'postmark';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

// Re-export to make it easier to import this together with the singleton.
export type { ServerClient as PostmarkClient } from 'postmark';

export class PostmarkClientSingleton {
  private static clientSingleton?: ServerClient;

  /**
   * Getter that will create the client singleton instance if it is not created
   * already.
   */
  static getClient(configService: ConfigService<EnvironmentVariables, true>) {
    if (PostmarkClientSingleton.clientSingleton !== undefined)
      return PostmarkClientSingleton.clientSingleton;

    // This env var is optional and only checked here, as this is not required
    // for development as services using this service like
    // `PostmarkTransactionalEmailService` will be mocked.
    const POSTMARK_API_KEY = configService.get('POSTMARK_API_KEY', {
      infer: true,
    });
    if (POSTMARK_API_KEY === undefined)
      throw new Error(
        `env var 'POSTMARK_API_KEY' cannot be undefined in Production`,
      );

    PostmarkClientSingleton.clientSingleton = new ServerClient(
      POSTMARK_API_KEY,
    );

    return PostmarkClientSingleton.clientSingleton;
  }
}
