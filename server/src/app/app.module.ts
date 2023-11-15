import { Module } from '@nestjs/common';

// Infra
import { AiServiceProvider } from '../infra/index.js';
import { StripeClient } from './stripe/infra/stripe-client.js';

// Services
import { ApiKeyService } from './apikey/services/apikey.service.js';
import { CustomerService } from './customer/services/customer.service.js';
import { CustomerApiService } from './customer/services/customer.api.service.js';
import { FeedbackService } from './feedback/services/feedback.service.js';
import { OrgService } from './org/services/org.service.js';
import { PmfscoreService } from './pmfscore/services/pmfscore.service.js';
import { ProductService } from './product/services/product.service.js';
import { StripeSubscriptionService } from './stripe/services/subscription.service.js';
import { StripeBuySubscriptionService } from './stripe/services/buy-subscription.service.js';
import { StripeCustomerService } from './stripe/services/customer.service.js';
import { StripeSetupintentService } from './stripe/services/setupintent.service.js';
import { SubscriptionService } from './subscription/services/subscription.service.js';
import { SurveyMethodManualEmailBlastService } from './surveymethod/services/email-manual.service.js';
import { TaskService } from './task/services/task.service.js';
import { TeamService } from './team/services/team.service.js';
import { UserService } from './user/services/user.service.js';

// Controllers
import { BasicController } from './basic/controllers/basic.controller.js';
import { ApiKeyController } from './apikey/controllers/apikey.controller.js';
import { CustomerController } from './customer/controllers/customer.controller.js';
import { CustomerApiController } from './customer/controllers/customer.api.controller.js';
import { FeedbackController } from './feedback/controllers/feedback.controller.js';
import { FeedbackResponseController } from './feedback/controllers/feedback-response.controller.js';
import { LandingController } from './landing/controllers/landing.controller.js';
import { OrgController } from './org/controllers/org.controller.js';
import { PmfscoreController } from './pmfscore/controllers/pmfscore.controller.js';
import { ProductController } from './product/controllers/product.controller.js';
import { StripeCustomerController } from './stripe/controllers/customer.controller.js';
import { StripeSetupintentController } from './stripe/controllers/setupintent.controller.js';
import { StripeSubscriptionController } from './stripe/controllers/subscription.controller.js';
import { StripeWebhookController } from './stripe/controllers/webhook.controller.js';
import { SubscriptionController } from './subscription/controllers/subscription.controller.js';
import { SurveyMethodManualEmailBlastController } from './surveymethod/controllers/email-manual.controller.js';
import { TaskController } from './task/controllers/task.controller.js';
import { TeamController } from './team/controllers/team.controller.js';
import { UserController } from './user/controllers/user.controller.js';

/**
 * App module used to tie all application controllers/services together.
 */
@Module({
  providers: [
    // Infra Providers
    AiServiceProvider,
    StripeClient,

    // App Services
    ApiKeyService,
    CustomerService,
    CustomerApiService,
    FeedbackService,
    OrgService,
    PmfscoreService,
    ProductService,
    StripeSubscriptionService,
    StripeBuySubscriptionService,
    StripeCustomerService,
    StripeSetupintentService,
    SubscriptionService,
    SurveyMethodManualEmailBlastService,
    TaskService,
    TeamService,
    UserService,
  ],

  controllers: [
    BasicController,
    ApiKeyController,
    CustomerController,
    CustomerApiController,
    FeedbackController,
    FeedbackResponseController,
    LandingController,
    OrgController,
    PmfscoreController,
    ProductController,
    StripeCustomerController,
    StripeSetupintentController,
    StripeSubscriptionController,
    StripeWebhookController,
    SubscriptionController,
    SurveyMethodManualEmailBlastController,
    TaskController,
    TeamController,
    UserController,
  ],
})
export class AppModule {}
