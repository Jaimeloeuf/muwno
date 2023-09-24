import { Module } from '@nestjs/common';

// Infra
import { Stripe } from './infra/stripe.infra.js';

// Services
import { SubscriptionService } from './services/subscription.service.js';
import { StripeSetupintentService } from './services/stripe-setupintent.service.js';
import { StripeBuySubscriptionService } from './services/stripe-buy-subscription.service.js';
import { StripeCustomerService } from './services/stripe-customer.service.js';
import { StripeService } from './services/stripe.service.js';

// Controllers
import { SubscriptionController } from './controllers/subscription.controller.js';
import { StripeSubscriptionController } from './controllers/stripe-subscription.controller.js';
import { StripeCustomerController } from './controllers/stripe-customer.controller.js';
import { StripeWebhookController } from './controllers/stripe-webhook.controller.js';

@Module({
  providers: [
    Stripe,
    StripeSetupintentService,
    StripeBuySubscriptionService,
    StripeCustomerService,
    StripeService,
    SubscriptionService,
  ],

  controllers: [
    SubscriptionController,
    StripeSubscriptionController,
    StripeCustomerController,
    StripeWebhookController,
  ],

  // Export these services so other modules can use these
  exports: [StripeService, StripeCustomerService],
})
export class SubscriptionModule {}
