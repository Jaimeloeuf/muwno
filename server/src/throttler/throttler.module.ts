import { ThrottlerModule as _ThrottlerModule } from '@nestjs/throttler';

import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../config/types.js';

/**
 * `ThrottlerModule` created by configuring '@nestjs/throttler'
 *
 * ThrottlerModule uses an in memory cache by default, which means if there
 * is more than one instance running at the same time, the rate limit will
 * not be shared unless a shared cache is used. i.e. This is a per instance
 * DDOS rate limitng protection by IP address.
 *
 * However note that because this is an in memory cache, and it rate limits
 * by individual IP and ROUTE, which means that it might use alot of memory
 * and cause the service to die from OOM error (out of memory).
 *
 * ---
 *
 * This Module is injected globally with sensible defaults, individual routes
 * can choose to use a more limited throttling setting as needed.
 *
 * Reference: https://docs.nestjs.com/security/rate-limiting#customization
 *
 * ---
 *
 * Since this will be ran behind a proxy when hosted with services like AWS
 * ECS / GCP Cloud Run, the express app must be configured to 'trust proxy'
 * so that the client's actual IP address will be exposed to the server for
 * rate limiting. See server's main.ts's express app configuration.
 *
 * References:
 * https://docs.nestjs.com/security/rate-limiting#proxies
 * https://expressjs.com/en/guide/behind-proxies.html
 */
export const ThrottlerModule = _ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
    ttl: config.get('THROTTLE_TTL', { infer: true }),
    limit: config.get('THROTTLE_LIMIT', { infer: true }),
  }),
});
