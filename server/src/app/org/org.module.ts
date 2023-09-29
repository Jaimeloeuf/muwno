import { Module } from '@nestjs/common';

// Modules
import { StripeModule } from '../stripe/stripe.module.js';

// Services
import { OrgService } from './services/org.service.js';

// Controllers
import { OrgController } from './controllers/org.controller.js';

@Module({
  imports: [StripeModule],

  providers: [OrgService],

  controllers: [OrgController],

  // Export these services so other modules can use these
  exports: [OrgService],
})
export class OrgModule {}
