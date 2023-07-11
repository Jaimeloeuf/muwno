/**
 * @module throttler.provider
 *
 * Exports a class provider to inject Throttler globally, to rate limit API calls.
 */

import type { ClassProvider } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * `ThrottlerProvider` for NestJS's default `APP_GUARD` token.
 *
 * For this to work when the API service is ran behind a proxy,
 * Express's `trust proxy` setting must be `true` in `main.ts`
 *
 * https://docs.nestjs.com/security/rate-limiting
 */
export const ThrottlerProvider: ClassProvider<ThrottlerGuard> = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};
