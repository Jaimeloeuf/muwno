import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module.js';
import { GlobalModule } from './global/global.module.js';
import { ThrottlerModule } from './throttler/throttler.module.js';
import { ThrottlerProvider } from './throttler/throttler.provider.js';
import { AppModule } from './app/app.module.js';

/**
 * Root module used to tie everything together.
 */
@Module({
  imports: [
    // ConfigModule is configured be registered globally too.
    ConfigModule,

    // Register the global module that registers all the providers globally.
    GlobalModule,

    // ThrottlerModule needs to be registered here globally for all to use.
    ThrottlerModule,

    // Application modules that encapsulates all feature modules
    AppModule,
  ],

  providers: [
    // Throttler is injected globally so all routes are protected with the
    // default rate limiting settings.
    ThrottlerProvider,
  ],
})
export class RootModule {}
