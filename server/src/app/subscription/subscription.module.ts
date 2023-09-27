import { Module } from '@nestjs/common';

// Infra
import { StripeClient } from './infra/stripe.infra.js';

// Services
import { SubscriptionService } from './services/subscription.service.js';
import { StripeSubscriptionService } from './services/stripe-subscription.service.js';
import { StripeBuySubscriptionService } from './services/stripe-buy-subscription.service.js';
import { StripeCustomerService } from './services/stripe-customer.service.js';
import { StripeSetupintentService } from './services/stripe-setupintent.service.js';

// Controllers
import { SubscriptionController } from './controllers/subscription.controller.js';
import { StripeCustomerController } from './controllers/stripe-customer.controller.js';
import { StripeSetupintentController } from './controllers/stripe-setupintent.controller.js';
import { StripeSubscriptionController } from './controllers/stripe-subscription.controller.js';
import { StripeWebhookController } from './controllers/stripe-webhook.controller.js';

@Module({
  providers: [
    StripeClient,
    SubscriptionService,
    StripeSubscriptionService,
    StripeBuySubscriptionService,
    StripeCustomerService,
    StripeSetupintentService,
  ],

  controllers: [
    SubscriptionController,
    StripeCustomerController,
    StripeSetupintentController,
    StripeSubscriptionController,
    StripeWebhookController,
  ],

  // Export these services so other modules can use these
  exports: [StripeCustomerService],
})
export class SubscriptionModule {}
