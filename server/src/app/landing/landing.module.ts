import { Module } from '@nestjs/common';

// Infra
import { TelegramBotProvider } from '../../infra/providers/index.js';

// Controllers
import { LandingController } from './controllers/landing.controller.js';

@Module({
  providers: [TelegramBotProvider],

  controllers: [LandingController],
})
export class LandingModule {}
