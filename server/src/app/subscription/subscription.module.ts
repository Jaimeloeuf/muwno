import { Module } from '@nestjs/common';

// Infra
import { Stripe } from './infra/stripe.infra.js';

// Services
import { SubscriptionService } from './services/subscription.service.js';
import { StripeSetupintentService } from './services/stripe-setupintent.service.js';
import { StripeSubscriptionService } from './services/stripe-subscription.service.js';
import { StripeService } from './services/stripe.service.js';

// Controllers
import { SubscriptionController } from './controllers/subscription.controller.js';
import { StripeSubscriptionController } from './controllers/stripe-subscription.controller.js';
import { StripeWebhookController } from './controllers/stripe-webhook.controller.js';

@Module({
  providers: [
    Stripe,
    StripeSetupintentService,
    StripeSubscriptionService,
    StripeService,
    SubscriptionService,
  ],

  controllers: [
    SubscriptionController,
    StripeSubscriptionController,
    StripeWebhookController,
  ],

  // Export these services so other modules can use these
  exports: [StripeService],
})
export class SubscriptionModule {}
