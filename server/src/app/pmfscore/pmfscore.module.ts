import { Module } from '@nestjs/common';

// Modules
import { ProductModule } from '../product/product.module.js';

// Services
import { PmfscoreService } from './services/pmfscore.service.js';

// Controllers
import { PmfscoreController } from './controllers/pmfscore.controller.js';

@Module({
  imports: [ProductModule],

  providers: [PmfscoreService],

  controllers: [PmfscoreController],
})
export class PmfscoreModule {}
