import { Module } from '@nestjs/common';

// Controllers
import { LandingController } from './controllers/landing.controller.js';

@Module({
  controllers: [LandingController],
})
export class LandingModule {}
