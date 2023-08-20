import { Module } from '@nestjs/common';

// Infra
import { StripeService } from '../../infra/index.js';

// Services
import { SubscriptionService } from './services/subscription.service.js';

// Controllers
import { SubscriptionController } from './controllers/subscription.controller.js';
import { StripeWebhookController } from './controllers/stripe-webhook.controller.js';

@Module({
  providers: [StripeService, SubscriptionService],

  controllers: [SubscriptionController, StripeWebhookController],
})
export class SubscriptionModule {}
