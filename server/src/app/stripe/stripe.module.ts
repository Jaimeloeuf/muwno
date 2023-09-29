import { Module } from '@nestjs/common';

// Modules
import { SubscriptionModule } from '../subscription/subscription.module.js';

// Infra
import { StripeClient } from './infra/stripe-client.js';

// Services
import { StripeSubscriptionService } from './services/subscription.service.js';
import { StripeBuySubscriptionService } from './services/buy-subscription.service.js';
import { StripeCustomerService } from './services/customer.service.js';
import { StripeSetupintentService } from './services/setupintent.service.js';

// Controllers
import { StripeCustomerController } from './controllers/customer.controller.js';
import { StripeSetupintentController } from './controllers/setupintent.controller.js';
import { StripeSubscriptionController } from './controllers/subscription.controller.js';
import { StripeWebhookController } from './controllers/webhook.controller.js';

@Module({
  imports: [SubscriptionModule],

  providers: [
    StripeClient,
    StripeSubscriptionService,
    StripeBuySubscriptionService,
    StripeCustomerService,
    StripeSetupintentService,
  ],

  controllers: [
    StripeCustomerController,
    StripeSetupintentController,
    StripeSubscriptionController,
    StripeWebhookController,
  ],

  // Export these services so other modules can use these
  exports: [StripeCustomerService],
})
export class StripeModule {}
