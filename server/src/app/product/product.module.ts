import { Module } from '@nestjs/common';

// Services
import { ProductService } from './services/product.service.js';

// Controllers
import { ProductController } from './controllers/product.controller.js';

@Module({
  providers: [ProductService],

  controllers: [ProductController],

  // Export these services so other modules can use these
  exports: [ProductService],
})
export class ProductModule {}
