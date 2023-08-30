import { Module } from '@nestjs/common';

// Modules
import { ProductModule } from '../product/product.module.js';

// Services
import { ApiKeyService } from './services/apikey.service.js';

// Controllers
import { ApiKeyController } from './controllers/apikey.controller.js';

@Module({
  imports: [ProductModule],

  providers: [ApiKeyService],

  controllers: [ApiKeyController],
})
export class ApiKeyModule {}
