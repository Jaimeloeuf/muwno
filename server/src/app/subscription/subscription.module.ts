import { Module } from '@nestjs/common';

// Services
import { SubscriptionService } from './services/subscription.service.js';

// Controllers
import { SubscriptionController } from './controllers/subscription.controller.js';

@Module({
  providers: [SubscriptionService],

  controllers: [SubscriptionController],

  // Export these services so other modules can use these
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
