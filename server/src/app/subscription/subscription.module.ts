import { Module } from '@nestjs/common';

// Services
import { SubscriptionService } from './services/subscription.service.js';

// Controllers
import { SubscriptionController } from './controllers/subscription.controller.js';

@Module({
  providers: [SubscriptionService],

  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
