import { Module } from '@nestjs/common';

// Modules
import { OrgModule } from '../org/org.module.js';
import { UserModule } from '../user/user.module.js';

// Services
import { ApiKeyService } from './services/apikey.service.js';

// Controllers
import { ApiKeyController } from './controllers/apikey.controller.js';

@Module({
  imports: [OrgModule, UserModule],

  providers: [ApiKeyService],

  controllers: [ApiKeyController],
})
export class ApiKeyModule {}
