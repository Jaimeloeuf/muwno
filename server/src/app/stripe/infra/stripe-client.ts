import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

/**
 * Stripe Client setup with config module.
 */
@Injectable()
export class StripeClient extends Stripe {
  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    const nodeEnv = configService.get('NODE_ENV', { infer: true });
    const version = configService.get('version', { infer: true });

    super(
      configService.get('STRIPE_SECRET_KEY', { infer: true }),

      {
        // API Version is hardcoded as updating this will usually require code
        // update and is not just a configuration change.
        apiVersion: '2023-10-16',

        // For support and debugging (not required for production)
        appInfo: {
          name: `muwno-${nodeEnv}-${version}`,
          version,
          url: 'https://muwno.com',
        },
      },
    );
  }
}
