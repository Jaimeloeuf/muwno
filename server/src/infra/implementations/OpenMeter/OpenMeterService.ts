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
      this.logger.error(
        'Failed to send event to OpenMeter',
        error,
        OpenMeterService.name,
      );
      return false;
    }
  }

  /**
   * ## Important note about from/to timestamps
   * It **MUST** be rounded to nearest MINUTE like YYYY-MM-DDTHH:mm:00
   *
   * `to` must also be a time that has already passed, so it cannot be in the
   * future. The closest value for `to` is the start of the current minute.
   */
  async queryEvent(
    meterID: string,
    subject: string,
    from?: string,
    to?: string,
  ) {
    try {
      const queryParameters: Record<string, string> = {
        subject,

        // `windowSize` is optional, leave it blank to get all values in the
        // given period. Use this to get usage data broken down by the given
        // window size to for example show users a graph of their usage over time.
        //
        // use 'DAY' for start of a day in UTC to previous 24 hours
        // use 'MINUTE' for start of current minute in UTC to previous minute
      };

      // Include query time range if given
      if (from !== undefined) queryParameters['from'] = from;
      if (to !== undefined) queryParameters['to'] = to;

      const queryString = new URLSearchParams(queryParameters).toString();

      const { body }: { body: { data: Array<{ value: number }> } } =
        await TinyJsonHttp.get({
          url: `${this.baseUrl}/api/v1/meters/${meterID}/query?${queryString}`,
          headers: {
            'Content-Type': 'application/cloudevents+json',
            authorization: `Bearer ${this.OPENMETER_API_KEY}`,
          },
        });

      // Extract out the numerical value ONLY
      // Since the other data are not used at all.
      return body.data[0]?.value ?? null;
    } catch (error) {
      this.logger.error(
        'Failed to query OpenMeter',
        error,
        OpenMeterService.name,
      );
      return null;
    }
  }
}
