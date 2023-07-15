import { Module } from '@nestjs/common';

// Services
import { ProductService } from './services/product.service.js';

// Controllers
import { ProductController } from './controllers/product.controller.js';

@Module({
  providers: [ProductService],

  controllers: [ProductController],
})
export class ProductModule {}
