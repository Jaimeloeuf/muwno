import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';

import { RootModule } from './root.module.js';
import { GlobalValidationPipe } from './utils/GlobalValidationPipe.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    RootModule,

    // Since this service will be ran on a different domain than the portal,
    // CORS needs to be enabled for the portal's API requests to work.
    { cors: true },
  );

  // Disable adding `x-powered-by` header on HTTP responses to give out as
  // little information about the server as possible to minimize attack vectors.
  app.disable('x-powered-by');

  // Turning on `trust proxy` setting so that the rate limiter `@nestjs/throttler`
  // package can work better by rate limiting base on client IP address rather
  // than the reverse proxy's IP address.
  //
  // https://expressjs.com/en/guide/behind-proxies.html
  // https://expressjs.com/en/api.html#req.ip
  app.set('trust proxy', true);

  await app

    // Enable global URI versioning, which uses the version passed within the URI
    // of the request, e.g. version 1 will be `https://example.com/v1/route`
    .enableVersioning({
      type: VersioningType.URI,

      // Set default for every controller/route that does not have a version specified
      defaultVersion: '1',
    })

    // Bind required pipes globally
    .useGlobalPipes(
      // Bind ValidationPipe at application level to ensure all endpoints
      // only receive validated/correct data.
      GlobalValidationPipe,
    )

    // Use the provided PORT if given via a env variable, else defaults to PORT 3000
    .listen(process.env['PORT'] ?? 3000);
}

bootstrap();
