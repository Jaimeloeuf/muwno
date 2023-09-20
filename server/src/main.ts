import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';

import { RootModule } from './root.module.js';
import { GlobalValidationPipe } from './utils/GlobalValidationPipe.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    RootModule,

    {
      // Since this service will be ran on a different domain than the portal,
      // CORS needs to be enabled for the portal's API requests to work.
      cors: true,

      // Allow controllers to access the raw Request body so that it can perform
      // webhook signature verifications using the unserialized request body to
      // calculate a HMAC hash. This is used for handling Stripe Webhook Events.
      //
      // This feature can be used only if the built-in global body parser
      // middleware is enabled, ie., you must not pass `bodyParser: false`
      // when creating the app.
      //
      // Reference: https://docs.nestjs.com/faq/raw-body
      rawBody: true,
    },
  );

  // Disable adding `x-powered-by` header on HTTP responses to give out as
  // little information about the server as possible to minimize attack vectors.
  app.disable('x-powered-by');

  // Turning on `trust proxy` setting so that the `@nestjs/throttler` package
  // can work better by rate limiting base on client IP address rather than
  // reverse proxy's IP address.
  //
  // https://expressjs.com/en/guide/behind-proxies.html
  // https://expressjs.com/en/api.html#req.ip
  app.set('trust proxy', true);

  await app

    // Enable global URI versioning, which uses the version passed in the URI
    // of the request, e.g. version 1 will be `https://example.com/v1/route`
    .enableVersioning({
      type: VersioningType.URI,

      // Default version for routes that does not have a specified version
      defaultVersion: '1',
    })

    // Bind required pipes globally
    .useGlobalPipes(
      // Bind ValidationPipe at application level to ensure all endpoints
      // only receive validated/correct data.
      GlobalValidationPipe,
    )

    // Use provided PORT if set via a env variable, else defaults to PORT 3000
    .listen(process.env['PORT'] ?? 3000);
}

bootstrap();
