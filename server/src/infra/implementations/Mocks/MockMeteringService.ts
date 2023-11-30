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
      `${MockMeteringService.name}.${MockMeteringService.prototype.trackEvent.name}`,
    );

    return true;
  }

  async queryEvent(
    meterID: string,
    subject: string,
    from?: string,
    to?: string,
  ) {
    this.logger.debug(
      {
        meterID,
        subject,
        from,
        to,
      },
      `${MockMeteringService.name}.${MockMeteringService.prototype.queryEvent.name}`,
    );

    return null;
  }
}
