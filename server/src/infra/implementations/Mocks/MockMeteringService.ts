import { Injectable, Logger } from '@nestjs/common';

import type { IMeteringService } from '../../abstractions/IMeteringService.js';

@Injectable()
export class MockMeteringService implements IMeteringService {
  constructor(private readonly logger: Logger) {}

  async trackEvent(
    id: string,
    type: string,
    subject: string,
    data: Record<string, string | number>,
  ) {
    this.logger.debug(
      {
        time: new Date(),
        id,
        type,
        subject,
        data,
      },
      MockMeteringService.name,
    );

    return true;
  }
}