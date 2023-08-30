import { Module } from '@nestjs/common';

// Feature Modules
import { BasicModule } from './basic/basic.module.js';
import { FeedbackModule } from './feedback/feedback.module.js';
import { UserModule } from './user/user.module.js';
import { OrgModule } from './org/org.module.js';
import { ProductModule } from './product/product.module.js';
import { TaskModule } from './task/task.module.js';
import { TeamModule } from './team/team.module.js';
import { SubscriptionModule } from './subscription/subscription.module.js';
import { ApiKeyModule } from './apikey/apikey.module.js';
import { LandingModule } from './landing/landing.module.js';

/**
 * App module used to tie all application feature modules together.
 */
@Module({
  imports: [
    BasicModule,
    FeedbackModule,
    UserModule,
    OrgModule,
    ProductModule,
    TaskModule,
    TeamModule,
    SubscriptionModule,
    ApiKeyModule,
    LandingModule,
  ],
})
export class AppModule {}
