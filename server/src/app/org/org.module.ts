import { Module } from '@nestjs/common';

// Services
import { OrgService } from './services/org.service.js';

// Controllers
import { OrgController } from './controllers/org.controller.js';

@Module({
  providers: [OrgService],

  controllers: [OrgController],
})
export class OrgModule {}
