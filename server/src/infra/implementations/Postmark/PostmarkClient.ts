import { Injectable } from '@nestjs/common';
import { ServerClient } from 'postmark';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

/**
 * Postmark Server Client setup with config module. Postmark Server Client is a
 * singleton so that it is only created once and reused.
 */
@Injectable()
export class PostmarkClient extends ServerClient {
  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    super(configService.get('POSTMARK_API_KEY', { infer: true }));
  }
}
