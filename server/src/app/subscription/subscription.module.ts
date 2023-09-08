import { Module } from '@nestjs/common';

// Services
import { SubscriptionService } from './services/subscription.service.js';
import { StripeService } from './services/stripe.service.js';

// Controllers
import { StripeSubscriptionController } from './controllers/stripe-subscription.controller.js';
import { StripeWebhookController } from './controllers/stripe-webhook.controller.js';

@Module({
  providers: [StripeService, SubscriptionService],

  controllers: [StripeSubscriptionController, StripeWebhookController],

  // Export these services so other modules can use these
  exports: [StripeService],
})
export class SubscriptionModule {}
