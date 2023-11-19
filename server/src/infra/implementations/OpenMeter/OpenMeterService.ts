import { Injectable, Logger } from '@nestjs/common';
import TinyJsonHttp from 'tiny-json-http';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { Event as OpenMeterEvent } from '@openmeter/sdk';

import type { IMeteringService } from '../../abstractions/IMeteringService.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

@Injectable()
export class OpenMeterService implements IMeteringService {
  /**
   * Base URL of the openmeter client. Hardcoding it as we are using the cloud
   * hosted version of it exclusively.
   */
  private readonly baseUrl = `https://openmeter.cloud`;

  /**
   * API Key read from env var.
   */
  private readonly OPENMETER_API_KEY: string;

  constructor(
    private readonly logger: Logger,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    // These env var are optional and only checked here, as they are not
    // required for local dev since this service will be mocked.

    const OPENMETER_API_KEY = configService.get('OPENMETER_API_KEY', {
      infer: true,
    });
    if (OPENMETER_API_KEY === undefined)
      throw new Error(
        `env var 'OPENMETER_API_KEY' cannot be undefined in Production`,
      );

    this.OPENMETER_API_KEY = OPENMETER_API_KEY;
  }

  async trackEvent(
    id: string,
    type: string,
    subject: string,
    data: Record<string, string | number>,
  ) {
    try {
      await TinyJsonHttp.post({
        url: `${this.baseUrl}/api/v1/events`,
        headers: {
          'Content-Type': 'application/cloudevents+json',
          authorization: `Bearer ${this.OPENMETER_API_KEY}`,
        },
        data: {
          specversion: '1.0',
          source: 'api-service',
          time: new Date(),

          id,
          type,
          subject,
          data,
        } satisfies OpenMeterEvent,
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to send event to OpenMeter', error);
      return false;
    }
  }
}